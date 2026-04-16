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
    // Helper to read cookies safely
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const hydrateAuth = async () => {
      // If Redux is already authenticated, we are good.
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      const role = getCookie("userRole");
      const rawEmail = getCookie("userEmail");
      const permissionsStr = getCookie("userPermissions");
      const userName = getCookie("userName");
      const userAvatar = getCookie("userAvatar");
      const email = rawEmail ? decodeURIComponent(rawEmail) : "";

      if (role) {
        let p: string[] = [];
        try {
          if (permissionsStr) p = JSON.parse(decodeURIComponent(permissionsStr));
        } catch {}

        try {
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!refreshRes.ok) {
            setIsChecking(false);
            return;
          }

          const refreshPayload = await refreshRes.json();
          const accessToken = refreshPayload?.access_token;

          if (!accessToken) {
            setIsChecking(false);
            return;
          }

          dispatch(updateTokens({ accessToken }));


          const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/me`, {
            method: 'GET',
            credentials: 'include',
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (meRes.ok) {
            const mePayload = await meRes.json();
            const me = mePayload.data || {};
            dispatch(
              setCredentials({
                user: {
                  name: me.name || (userName ? decodeURIComponent(userName) : "User"),
                  email: me.email || email,
                  role: me.role || role,
                  avatar: me.avatar || null,
                  permissions: me.permissions || p,
                },
                accessToken,
              }),
            );

          } else {
            dispatch(
              setCredentials({
                user: {
                  name: userName ? decodeURIComponent(userName) : "User",
                  email,
                  role,
                  avatar: userAvatar ? decodeURIComponent(userAvatar) : null,
                  permissions: p,
                },
                accessToken,
              }),
            );
          }
        } catch (error) {
          console.error('Session hydrate failed:', error);
        }
      }

      setIsChecking(false);
    };

    hydrateAuth();
  }, [isAuthenticated, dispatch]);

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

    // 3. Clear Client-side Cookies
    const cookiesToClear = ["refreshToken", "authSession", "userRole", "userEmail", "userName", "userPermissions", "reset_verified"];
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

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
