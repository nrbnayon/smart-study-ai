export const AUTH_COOKIE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userRole: "userRole",
  userEmail: "userEmail",
} as const;

type AuthCookieKey = (typeof AUTH_COOKIE_KEYS)[keyof typeof AUTH_COOKIE_KEYS];

export interface AuthCookiePayload {
  accessToken?: string | null;
  refreshToken?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
}

interface CookieOptions {
  maxAgeSeconds?: number;
}

const getSecureFlag = () =>
  process.env.NODE_ENV === "production" ? "; Secure" : "";

const setClientCookie = (
  key: AuthCookieKey,
  value: string,
  options?: CookieOptions,
) => {
  if (typeof document === "undefined") return;

  const maxAgePart =
    typeof options?.maxAgeSeconds === "number"
      ? `; Max-Age=${options.maxAgeSeconds}`
      : "";

  document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${getSecureFlag()}${maxAgePart}`;
};

const removeClientCookie = (key: AuthCookieKey) => {
  if (typeof document === "undefined") return;
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${getSecureFlag()}`;
};

export const getClientCookie = (key: AuthCookieKey): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length !== 2) return null;

  const raw = parts.pop()?.split(";").shift();
  return raw ? decodeURIComponent(raw) : null;
};

export const setAuthCookies = (
  payload: AuthCookiePayload,
  options?: CookieOptions,
) => {
  if (payload.accessToken) {
    setClientCookie(AUTH_COOKIE_KEYS.accessToken, payload.accessToken, options);
  } else {
    removeClientCookie(AUTH_COOKIE_KEYS.accessToken);
  }

  if (payload.refreshToken) {
    setClientCookie(
      AUTH_COOKIE_KEYS.refreshToken,
      payload.refreshToken,
      options,
    );
  } else {
    removeClientCookie(AUTH_COOKIE_KEYS.refreshToken);
  }

  if (payload.userRole) {
    setClientCookie(AUTH_COOKIE_KEYS.userRole, payload.userRole, options);
  } else {
    removeClientCookie(AUTH_COOKIE_KEYS.userRole);
  }

  if (payload.userEmail) {
    setClientCookie(AUTH_COOKIE_KEYS.userEmail, payload.userEmail, options);
  } else {
    removeClientCookie(AUTH_COOKIE_KEYS.userEmail);
  }
};

export const clearAuthCookies = () => {
  removeClientCookie(AUTH_COOKIE_KEYS.accessToken);
  removeClientCookie(AUTH_COOKIE_KEYS.refreshToken);
  removeClientCookie(AUTH_COOKIE_KEYS.userRole);
  removeClientCookie(AUTH_COOKIE_KEYS.userEmail);
};

export const readAuthCookies = (): Required<AuthCookiePayload> => ({
  accessToken: getClientCookie(AUTH_COOKIE_KEYS.accessToken),
  refreshToken: getClientCookie(AUTH_COOKIE_KEYS.refreshToken),
  userRole: getClientCookie(AUTH_COOKIE_KEYS.userRole),
  userEmail: getClientCookie(AUTH_COOKIE_KEYS.userEmail),
});
