// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, updateTokens } from "./authSlice";

// Helper to clear cookies
const clearAuthCookies = () => {
  if (typeof document === "undefined") return;
  const cookiesToClear = [
    "accessToken",
    "refreshToken",
    "authSession",
    "userRole",
    "userEmail",
    "userName",
    "userAvatar",
    "userPermissions",
    "reset_verified",
  ];
  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

interface RefreshTokenResponse {
  message: string;
  access_token: string;
  expires_in: number;
  expires_at: number;
}

// ─── Base Query ───────────────────────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  // The API base URL – endpoints already include /api/...
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Don't override Content-Type for FormData (browser sets it with boundary)
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// Shared promise to prevent multiple concurrent refresh calls
let refreshPromise: Promise<boolean | null> | null = null;

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  // If a refresh is currently in progress, wait for it before proceeding with ANY request
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If not already refreshing, start a new refresh process
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            { url: "/auth/refresh", method: "POST" },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const responseData = refreshResult.data as RefreshTokenResponse;
            const newAccessToken = responseData.access_token;

            if (newAccessToken) {
              api.dispatch(
                updateTokens({
                  accessToken: newAccessToken,
                  tokenExpiresAt: responseData.expires_at,
                })
              );
              return true;
            }
          }

          // If we reach here, refresh failed
          api.dispatch(logout());
          clearAuthCookies();
          return false;
        } catch {
          api.dispatch(logout());
          clearAuthCookies();
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    // Wait for the (existing or new) refresh to finish
    const refreshSuccessful = await refreshPromise;

    if (refreshSuccessful) {
      // Retry the initial query with the new token
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  // Define tag types for cache invalidation
  tagTypes: [
    "User", "Auth", "Dashboard", "Profile", "Settings", "AuditLogs",
    // BassInsight domain
    "Lakes", "LakeReviews", "LakeReports",
    "BassPorn", "MyCatches", "FavouriteCatches",
    "Reports", "MyReports",
    "Comments",
    "Contact", "MyContacts",
  ],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

export const {} = apiSlice;
