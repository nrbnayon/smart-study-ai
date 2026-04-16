"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, Fish, MapPin, Heart, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons/core-free-icons";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { useUser } from "@/hooks/useUser";
import { LogOut } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ElementType | any;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/", id: "home", icon: Fish },
  { label: "Lakes", href: "/lakes", id: "lakes", icon: MapPin },
  { label: "BassPorn", href: "/catches", id: "catches", icon: Heart },
  { label: "Reports", href: "/reports", id: "reports", icon: FileText },
  { label: "Contact", href: "/contact-us", id: "footer", icon: Mail02Icon },
];

const NavIcon = ({
  icon,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  className?: string;
}) => {
  if (
    typeof icon === "function" ||
    (icon && typeof icon === "object" && "render" in icon)
  ) {
    const Icon = icon as React.ElementType;
    return <Icon className={className} />;
  }
  return <HugeiconsIcon icon={icon} className={className} />;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    view: AuthView;
  }>({ isOpen: false, view: "login" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { isAuthenticated, role, name, avatar, logout } = useUser();

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.replace(`?${params.toString()}`, { scroll: false });

    if (value && window.scrollY < 200 && pathname === "/") {
      const lakesSection = document.getElementById("lakes");
      if (lakesSection) {
        lakesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const openAuth = (view: "login" | "signup") => {
    setAuthModal({ isOpen: true, view });
    setOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    const handleScroll = () => {
      // If at the very top, always show "home" as active
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Check if scrolled to the bottom
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;
      if (isBottom) {
        setActiveSection("footer");
        return;
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px", // Improved sensitivity
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    window.addEventListener("scroll", handleScroll);

    navLinks.forEach((link) => {
      const targetId = link.href.startsWith("#")
        ? link.href
        : link.id
          ? `#${link.id}`
          : null;
      if (targetId) {
        const element = document.querySelector(targetId);
        if (element) observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#1A365D]/80 py-4 text-white backdrop-blur-md transition-all duration-300">
        <div className="container-1620 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.png"
              alt="BassPort"
              width={160}
              height={48}
              className="w-32 md:w-40 h-auto"
              priority
            />
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
            <nav className="flex items-center gap-2">
              {navLinks.map((item) => {
                const isActive =
                  (item.href.startsWith("#") &&
                    activeSection === item.href.replace("#", "")) ||
                  (item.href === "/"
                    ? pathname === "/" && activeSection === "home"
                    : item.href.startsWith("/") && pathname === item.href) ||
                  (pathname === "/" && item.id === activeSection);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (item.href.startsWith("#")) {
                        setActiveSection(item.href.replace("#", ""));
                      }
                    }}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NavIcon icon={item.icon} className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="relative ml-4 w-full max-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search lakes, species..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Dashboard
                  </Link>
                )}

                <div className="group relative flex items-center gap-2">
                  <Link
                    href={role === "admin" ? "/admin/settings" : "/profile"}
                    className="flex flex-row items-center gap-2 bg-[#D1D5DB]/20 pl-1.5 pr-4 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div className="relative w-7 h-7">
                      {avatar ? (
                        <Image
                          src={resolveMediaUrl(avatar)}
                          alt="Avatar"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          quality={100}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex w-full h-full items-center justify-center rounded-full bg-[#FF7043] text-white font-bold text-xs">
                          {name ? name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                      {name || "User"}
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal({ isOpen: true, view: "login" })}
                  className="text-sm font-semibold text-white/80 transition hover:text-white cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal({ isOpen: true, view: "signup" })}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Join Free
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-4 border-t border-white/10 bg-[#112640]/95 px-6 py-5 backdrop-blur-lg lg:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const isActive =
                  (item.href.startsWith("#") &&
                    activeSection === item.href.replace("#", "")) ||
                  (item.href === "/"
                    ? pathname === "/" && activeSection === "home"
                    : item.href.startsWith("/") && pathname === item.href) ||
                  (pathname === "/" && item.id === activeSection);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      if (item.href.startsWith("#")) {
                        setActiveSection(item.href.replace("#", ""));
                      }
                    }}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition text-left cursor-pointer ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <NavIcon icon={item.icon} className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search lakes..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white focus:outline-none"
                  />
                </div>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 pt-2">
                    {role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="bg-white/10 rounded-lg px-4 py-2 text-sm font-semibold text-white text-center transition hover:bg-white/20"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href={role === "admin" ? "/admin/settings" : "/profile"}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 bg-[#D1D5DB]/20 pl-2 pr-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors w-fit"
                    >
                      <div className="relative w-8 h-8">
                        {avatar ? (
                          <Image
                            src={resolveMediaUrl(avatar)}
                            alt="Avatar"
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex w-full h-full items-center justify-center rounded-full bg-[#FF7043] text-white font-bold text-sm">
                            {name ? name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {name || "User"}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer p-2 w-fit"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => openAuth("login")}
                      className="flex-1 rounded-lg border border-white/25 px-4 py-2.5 text-center text-sm font-semibold text-white cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuth("signup")}
                      className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white cursor-pointer"
                    >
                      Join Free
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        redirectTo={pathname}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
        title="Sign Out"
        message="Are you sure you want to sign out of BassInsight?"
        confirmText="Sign Out"
        isDestructive={true}
      />
    </>
  );
}
