"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  logout,
  setCredentials,
  setHydrated,
  updateTokens,
} from "@/redux/features/authSlice";
import { clearAuthCookies, readAuthCookies } from "@/lib/authCookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    const bootstrap = async () => {
      dispatch(setHydrated(false));

      const { accessToken, refreshToken, userRole, userEmail } = readAuthCookies();

      let effectiveAccessToken = accessToken;

      if (!effectiveAccessToken && userRole && refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (refreshRes.ok) {
            const refreshPayload = await refreshRes.json();
            effectiveAccessToken = refreshPayload?.access_token || null;

            if (effectiveAccessToken) {
              dispatch(updateTokens({ accessToken: effectiveAccessToken }));
            }
          }
        } catch {
          // Continue to unauthenticated state.
        }
      }

      if (effectiveAccessToken && userRole) {
        dispatch(
          setCredentials({
            user: {
              name: "User",
              email: userEmail || "",
              role: userRole,
              avatar: null,
              permissions: [],
            },
            accessToken: effectiveAccessToken,
          }),
        );

        try {
          const meRes = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${effectiveAccessToken}` },
          });

          if (meRes.ok) {
            const mePayload = await meRes.json();
            const me = mePayload?.data || {};

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
              }),
            );
          }
        } catch {
          // Keep cookie-backed user state if /me fails.
        }
      } else {
        clearAuthCookies();
        dispatch(logout());
      }

      dispatch(setHydrated(true));
    };

    void bootstrap();
  }, [dispatch]);

  return null;
}
