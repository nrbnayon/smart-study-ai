"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCredentials,
  updateTokens,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/services/authApi";
import { clearAuthCookies, readAuthCookies, setAuthCookies } from "@/lib/authCookies";

export interface UserInfo {
  name: string | null;
  role: string | null;
  email: string | null;
  avatar: string | null;
  accessToken: string | null;
  permissions?: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Custom hook to manage user authentication state.
 * Synchronizes Redux state with backend session refresh.
 */
export function useUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Select from Redux Store (Single Source of Truth)
  const redUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Local loading state for initial hydration check
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hydrateAuth = async () => {
      // If Redux is already authenticated, we are good.
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      const { accessToken, refreshToken, userRole, userEmail } =
        readAuthCookies();

      let effectiveAccessToken = accessToken;

      if (!effectiveAccessToken && userRole && refreshToken) {
        try {
          const refreshRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            },
          );

          if (refreshRes.ok) {
            const refreshPayload = await refreshRes.json();
            effectiveAccessToken = refreshPayload?.access_token || null;

            if (effectiveAccessToken) {
              dispatch(updateTokens({ accessToken: effectiveAccessToken }));
              setAuthCookies({
                accessToken: effectiveAccessToken,
                refreshToken,
                userRole,
                userEmail,
              });
            }
          }
        } catch {
          // Ignore network errors during hydration and fall back to unauthenticated state.
        }
      }

      if (effectiveAccessToken && userRole) {
        dispatch(
          setCredentials({
            user: {
              name: redUser?.name || "User",
              email: userEmail || "",
              role: userRole,
              avatar: redUser?.avatar || null,
              permissions: redUser?.permissions || [],
            },
            accessToken: effectiveAccessToken,
            refreshToken: refreshToken || undefined,
          }),
        );

        try {
          const meRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/me`,
            {
              method: "GET",
              credentials: "include",
              headers: { Authorization: `Bearer ${effectiveAccessToken}` },
            },
          );

          if (meRes.ok) {
            const mePayload = await meRes.json();
            const me = mePayload.data || {};

            dispatch(
              setCredentials({
                user: {
                  name: me.name || "User",
                  email: me.email || userEmail || "",
                  role: me.role || userRole,
                  avatar: me.avatar || null,
                  permissions: me.permissions || [],
                },
                accessToken: effectiveAccessToken,
                refreshToken: refreshToken || undefined,
              }),
            );
          }
        } catch {
          // Keep cookie-backed user state if profile fetch fails.
        }
      }

      setIsChecking(false);
    };

    hydrateAuth();
  }, [isAuthenticated, dispatch, redUser?.avatar, redUser?.name, redUser?.permissions]);

  const hasRole = (role: string) => redUser?.role === role;

  const [logoutBackend] = useLogoutMutation();

  const logout = async () => {
    try {
      // 1. Call backend to clear HttpOnly cookies
      await logoutBackend().unwrap();
    } catch (err) {
      console.error("Backend logout failed:", err);
    }

    // 2. Clear Redux State
    dispatch(logoutAction());

    // 3. Clear client-side auth cookies
    clearAuthCookies();

    console.log("User logged out successfully");

    // 4. Redirect
    router.push("/");
  };

  const hasPermission = (atom: string) => {
    if (redUser?.role?.toLowerCase() === 'admin') return true;
    return redUser?.permissions?.includes(atom) || false;
  };

  return {
    name: redUser?.name || null,
    role: redUser?.role || null,
    email: redUser?.email || null,
    avatar: redUser?.avatar || null,
    permissions: redUser?.permissions || [],
    hasPermission,
    // We don't necessarily store the token string in the public `user` object in Redux if we want to be minimal,
    // but authSlice has it.
    accessToken: useAppSelector((state) => state.auth.accessToken),
    isAuthenticated,
    isLoading: isChecking,
    hasRole,
    logout,
  };
}
