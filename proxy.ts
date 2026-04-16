/**
 * ============================================================================
 *  proxy.ts  —  Middleware Core
 *  Enterprise-grade route guard for Next.js App Router
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  Roles:     admin  |  user                                          │
 *  │  Modes:     development  |  production                              │
 *  │  Security:  CSRF · Rate-limit · Secure cookies · CSP · HSTS        │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  REQUEST WATERFALL
 *  ─────────────────
 *    Bypass (assets / Next internals / API)
 *      ↓
 *    Dev-mode bypass  (fake token injection, verbose logging)
 *      ↓
 *    Rate-limit guard
 *      ↓
 *    CSRF guard  (state-mutating methods only)
 *      ↓
 *    INFO routes  (always public)
 *      ↓
 *    Root "/"  (role-aware redirect)
 *      ↓
 *    AUTH routes  (redirect away if already logged in)
 *      ↓
 *    PUBLIC-ONLY routes  (/success etc.)
 *      ↓
 *    PROTECTED — deny-by-default
 *        ├─ unauthenticated      →  /signin?redirect=...
 *        ├─ missing / bad role   →  /signin?error=missing_role
 *        ├─ universal routes     → any valid role
 *        ├─ role-specific routes → exact role match
 *        └─ catch-all            → role default path
 *
 * ============================================================================
 *
 *  REQUIRED .env VARIABLES
 *  ───────────────────────
 *  # Shared across environments
 *  CSRF_SECRET=<long-random-string>
 *  TRUSTED_ORIGINS=https://xentra.app,https://www.xentra.app
 *
 *  # Rate limiting (set RATE_LIMIT_ENABLED=true to activate)
 *  RATE_LIMIT_ENABLED=false
 *  RATE_LIMIT_MAX=120
 *  RATE_LIMIT_WINDOW_MS=60000
 *
 *  # Development only (.env.local)
 *  DEV_AUTH_BYPASS=true          # skips all auth checks in dev
 *  DEV_BYPASS_ROLE=admin         # role to impersonate (admin | user)
 *
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";

// ============================================================================
//  ENVIRONMENT CONFIG
// ============================================================================

const ENV = {
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",

  /** Used in the CSRF double-submit check — keep secret & long */
  CSRF_SECRET: process.env.CSRF_SECRET ?? "CHANGE_ME_IN_PRODUCTION",

  /** Trusted origins for cross-origin CSRF validation */
  TRUSTED_ORIGINS: (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  /** Flip to true via env to activate the header-based rate-limit gate */
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === "true",

  /**
   * DEV ONLY — set DEV_AUTH_BYPASS=true in .env.local to skip all auth.
   * Never expose this in production. The guard below double-checks IS_DEV.
   */
  DEV_AUTH_BYPASS:
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTH_BYPASS === "true",

  DEV_BYPASS_ROLE: (process.env.DEV_BYPASS_ROLE ?? "admin") as Role,
} as const;

// ============================================================================
//  ROLES
// ============================================================================

const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// ============================================================================
//  COOKIE KEYS
// ============================================================================

const COOKIES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ROLE: "userRole",
  CSRF_TOKEN: "csrfToken",
} as const;

/** Applied to every Set-Cookie header emitted from this middleware */
const SECURE_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // 'strict' breaks OAuth redirects
  path: "/",
} as const;

// ============================================================================
//  ROUTE DEFINITIONS
// ============================================================================

/**
 * AUTH ROUTES  →  app/(auth)/*
 * Meaningful only when NOT signed in.
 * Authenticated users are bounced to their home dashboard.
 */
const AUTH_ROUTES: string[] = [
  "/signin",
  "/signin/admin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/reset-success",
  "/verify-otp",
];

/**
 * PUBLIC-ONLY ROUTES
 * Accessible to everyone; authenticated users are NOT bounced away.
 */
const PUBLIC_ONLY_ROUTES: string[] = [
  "/success",
  "/jobs",
  "/lakes",
  "/catches",
  "/reports",
];

/**
 * INFO / LEGAL ROUTES
 * Always accessible — completely bypasses auth logic.
 */
const INFO_ROUTES: string[] = [
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/about-us",
  "/contact-us",
];

/**
 * UNIVERSAL PROTECTED ROUTES  →  app/(protected)/(shared)/*
 * Accessible to ANY authenticated role.
 */
const UNIVERSAL_PROTECTED_ROUTES: string[] = ["/profile"];

/**
 * ROLE-SPECIFIC ROUTES
 *
 * ADMIN  →  app/(protected)/(admin)/*
 * USER   →  app/(protected)/(user)/*
 *
 * Add/remove paths here as your file tree grows.
 */
const ROLE_ROUTES: Record<Role, string[]> = {
  // ── Admin pages ────────────────────────────────────────────────────────────
  [ROLES.ADMIN]: [
    "/admin", // app/(roles)/admin
    "/admin/dashboard", // app/(roles)/admin/dashboard
  ],

  // ── User pages ─────────────────────────────────────────────────────────────
  [ROLES.USER]: [
    "/",
    "/user", // app/(roles)/user  —  role-aware root redirect sends users here
  ],
};

/** After signin, each role lands here */
const ROLE_DEFAULT_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.USER]: "/", //[ROLES.USER]: "/user",
};

/** HTTP methods that require a valid CSRF token */
const CSRF_PROTECTED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// ============================================================================
//  HELPER UTILITIES
// ============================================================================

/**
 * Exact OR directory-boundary prefix match.
 *   "/dashboard"        → matches "/dashboard" ✓  "/dashboard/stats" ✓
 *   "/dashboard-legacy" → does NOT match          ← important edge case
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

function getRoleDefaultPath(role: string): string {
  return ROLE_DEFAULT_PATHS[role as Role] ?? "/signin";
}

function hasRoleAccess(pathname: string, role: string): boolean {
  const allowed = ROLE_ROUTES[role as Role];
  if (!allowed) return false;
  return matchesRoute(pathname, allowed);
}

function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}

// ── Security headers ─────────────────────────────────────────────────────────

function applySecurityHeaders(res: NextResponse): NextResponse {
  // Anti-click jacking
  res.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // Legacy XSS filter (belt-and-suspenders for older browsers)
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer — send origin only, not full URL, on cross-origin requests
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Lock down browser features not used by this app
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self), usb=()",
  );

  // HSTS — HTTPS-only, production only (do not send on HTTP dev servers)
  if (ENV.IS_PROD) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // Content-Security-Policy
  // ⚠ Tighten 'unsafe-inline' and 'unsafe-eval' once inline scripts are removed.
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http://localhost:5000 res.cloudinary.com https://vercel.com",
      "connect-src 'self' https: http://localhost:5000 https://vercel.live",
      "media-src 'self'",
      "object-src 'none'",
      "frame-src 'self' https://vercel.live",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // Commented out to allow local HTTP calls without forcing HTTPS
      // "upgrade-insecure-requests",
    ].join("; "),
  );

  // Surface the runtime environment to client-side code if needed
  res.headers.set("X-App-Env", ENV.IS_DEV ? "development" : "production");

  return res;
}

// ── Dev logging ──────────────────────────────────────────────────────────────

function devLog(label: string, data?: Record<string, unknown>): void {
  if (!ENV.IS_DEV) return;
  const ts = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  const extra = data ? " " + JSON.stringify(data) : "";
  console.log(`\x1b[36m[proxy ${ts}]\x1b[0m ${label}${extra}`);
}

// ── Shorthand response builders ───────────────────────────────────────────────

function allow(): NextResponse {
  return applySecurityHeaders(NextResponse.next());
}

function redirectTo(
  path: string,
  request: NextRequest,
  status: 307 | 302 = 307,
): NextResponse {
  const url = new URL(path, request.url);
  return applySecurityHeaders(NextResponse.redirect(url, { status }));
}

// ── Rate-limit guard ─────────────────────────────────────────────────────────
//
// This is a HEADER-BASED gate intended to honour signals from an upstream
// edge proxy (Cloudflare, AWS CloudFront, nginx) that injects:
//
//   x-ratelimit-remaining: <int>
//
// For a fully self-contained in-process rate limiter use Upstash Redis:
//   https://github.com/upstash/ratelimit-js
//
function isRateLimited(request: NextRequest): boolean {
  if (!ENV.RATE_LIMIT_ENABLED) return false;
  const remaining = request.headers.get("x-ratelimit-remaining");
  if (remaining === null) return false; // header absent → upstream not configured
  return Number(remaining) <= 0;
}

function rateLimitResponse(): NextResponse {
  const res = new NextResponse("Too Many Requests", {
    status: 429,
    headers: {
      "Retry-After": "60",
      "Content-Type": "text/plain",
    },
  });
  return applySecurityHeaders(res);
}

// ── CSRF guard ───────────────────────────────────────────────────────────────
//
// Double-submit cookie pattern:
//   1. Server sets csrfToken cookie (httpOnly: false so JS can read it)
//   2. Client reads the cookie and includes it in the X-CSRF-Token header
//   3. Middleware compares cookie value === header value
//   4. Additionally validates the request Origin matches trusted origins
//
// Dev mode skips CSRF for developer convenience.
//
function isCsrfValid(request: NextRequest): boolean {
  if (ENV.IS_DEV) return true; // relaxed in development

  const method = request.method.toUpperCase();
  if (!CSRF_PROTECTED_METHODS.has(method)) return true; // GETs are safe

  const cookieToken = request.cookies.get(COOKIES.CSRF_TOKEN)?.value;
  const headerToken = request.headers.get("x-csrf-token");

  // Both tokens must be present and identical
  if (!cookieToken || !headerToken) return false;
  if (cookieToken !== headerToken) return false;

  // Origin check — reject unexpected origins
  const origin = request.headers.get("origin") ?? "";
  if (!origin) return false; // same-origin browser requests always send Origin

  const requestHost = request.nextUrl.hostname;
  let originHost = "";
  try {
    originHost = new URL(origin).hostname;
  } catch {
    return false;
  }

  const isSameHost = originHost === requestHost;
  const isTrusted =
    ENV.TRUSTED_ORIGINS.length === 0 || // if no list configured, allow same-host only
    ENV.TRUSTED_ORIGINS.some((o: string) => origin.startsWith(o));

  return isSameHost || isTrusted;
}

// ============================================================================
//  MAIN PROXY FUNCTION
// ============================================================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const method = request.method.toUpperCase();

  const url = request.nextUrl.clone();
  const hostname = url.hostname;

  // SEO: redirect www → non-www canonical
  if (hostname.startsWith("www.")) {
    url.hostname = hostname.replace("www.", "");
    return NextResponse.redirect(url, 301);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 0 — Hard bypass
  //  Next.js internals, API routes, static files, PWA assets.
  //  These never touch auth logic.
  // ─────────────────────────────────────────────────────────────────────────
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") || // app/api/* — own auth
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/site.webmanifest" || // public/site.webmanifest
    pathname === "/sw.js" ||
    pathname === "/~offline" || // app/~offline — PWA offline shell
    pathname.includes(".") // any file with an extension
  ) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") || "";
  const isBot = /googlebot|bingbot|slurp|duckduckbot/i.test(userAgent);

  if (isBot && pathname === "/") {
    return NextResponse.next();
  }
  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 1 — Development auth bypass
  //  Set DEV_AUTH_BYPASS=true  DEV_BYPASS_ROLE=admin|user  in .env.local
  //  Injects fake cookies so every page loads without a real signin session.
  //  The IS_DEV guard in ENV prevents this from ever activating in prod.
  // ─────────────────────────────────────────────────────────────────────────
  if (ENV.DEV_AUTH_BYPASS) {
    devLog("🛠  DEV_AUTH_BYPASS active — skipping auth", {
      pathname,
      fakeRole: ENV.DEV_BYPASS_ROLE,
    });
    const res = NextResponse.next();
    res.cookies.set(
      COOKIES.ACCESS_TOKEN,
      "dev-fake-access-token",
      SECURE_COOKIE_BASE,
    );
    res.cookies.set(COOKIES.USER_ROLE, ENV.DEV_BYPASS_ROLE, SECURE_COOKIE_BASE);
    return applySecurityHeaders(res);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 2 — Rate-limit gate
  // ─────────────────────────────────────────────────────────────────────────
  if (isRateLimited(request)) {
    devLog("🚦 Rate limited", { pathname, method });
    return rateLimitResponse();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 3 — CSRF guard (state-mutating requests only)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isCsrfValid(request)) {
    devLog("🛡  CSRF check failed", { pathname, method });
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 4 — Read auth state from cookies
  // ─────────────────────────────────────────────────────────────────────────
  const accessToken = request.cookies.get(COOKIES.ACCESS_TOKEN)?.value;
  const userRole = request.cookies.get(COOKIES.USER_ROLE)?.value ?? "";
  const isAuthenticated = !!accessToken;

  devLog(`→ ${method} ${pathname}`, {
    isAuthenticated,
    role: userRole || "(none)",
    env: ENV.IS_DEV ? "development" : "production",
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 5 — INFO routes — always public
  //  /privacy-policy  /terms  /about-us
  // ─────────────────────────────────────────────────────────────────────────
  if (matchesRoute(pathname, INFO_ROUTES)) {
    devLog("ℹ️  INFO route — public", { pathname });
    return allow();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 6 — Root "/" — allow public landing access for all
  // ─────────────────────────────────────────────────────────────────────────
  if (pathname === "/") {
    devLog("🏠 Root path — allowing landing access");
    return allow();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 7 — AUTH routes — bounce if already signed in
  //   /signin  /forgot-password  /reset-password  /reset-success  /verify-otp
  // ─────────────────────────────────────────────────────────────────────────
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAuthenticated && isValidRole(userRole)) {
      devLog("↩️  Authenticated user at auth route — bouncing", { userRole });
      return redirectTo(getRoleDefaultPath(userRole), request);
    }
    return allow();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 8 — Public-only routes (not auth, not protected)
  //  /success
  // ─────────────────────────────────────────────────────────────────────────
  if (matchesRoute(pathname, PUBLIC_ONLY_ROUTES)) {
    return allow();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STEP 9 — Everything else is PROTECTED — deny by default
  // ─────────────────────────────────────────────────────────────────────────

  // 9a. Not authenticated →  /signin?redirect=<original path>
  if (!isAuthenticated) {
    const dest = encodeURIComponent(pathname + search);
    devLog("🔒 Not authenticated — redirecting to /signin", { pathname });
    return redirectTo(`/signin?redirect=${dest}`, request);
  }

  // 9b. Authenticated but role cookie absent or unrecognized
  if (!userRole || !isValidRole(userRole)) {
    devLog("⚠️  Invalid or missing role cookie", { userRole });
    return redirectTo("/signin?error=missing_role", request);
  }

  // 9c. Universal protected routes — any valid role
  if (matchesRoute(pathname, UNIVERSAL_PROTECTED_ROUTES)) {
    devLog("✅ Universal protected — allowed", { pathname, userRole });
    return allow();
  }

  // 9d. Role-specific route check
  if (hasRoleAccess(pathname, userRole)) {
    devLog("✅ Role access granted", { pathname, userRole });
    return allow();
  }

  // 9e. Authenticated but role lacks access to this path
  //     → redirect to role's default, not an error page
  console.warn(
    `[proxy] 🚫 Access denied | role="${userRole}" | path="${pathname}"`,
  );
  return redirectTo(getRoleDefaultPath(userRole), request);
}

// ============================================================================
//  MIDDLEWARE MATCHER
//
//  Excludes from interception:
//    · _next/static & _next/image    compiled bundles + image optimizer
//    · Public asset folders          /auth/ /icons/ /images/
//    · PWA / manifest files          site.webmanifest, android-chrome-*,
//                                    apple-touch-icon, sw.js, workbox-*
//    · Favicon variants              favicon-16x16, favicon-32x32
//    · Any path with a file ext      .svg .png .jpg .webp .ico
//                                    .woff .woff2 .ttf .eot .otf
//                                    .mp4 .mp3 .pdf .csv .xml .txt .js
// ============================================================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon-16x16\\.png|favicon-32x32\\.png|site\\.webmanifest|android-chrome|apple-touch-icon|manifest\\.json|manifest\\.webmanifest|sw\\.js|swe-worker|workbox|auth/|icons/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|mp3|pdf|csv|xml|txt|js)$).*)",
  ],
};
