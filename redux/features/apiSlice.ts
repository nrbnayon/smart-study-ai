// redux/features/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, updateTokens } from "./authSlice";
import { clearAuthCookies, readAuthCookies } from "@/lib/authCookies";

interface RefreshTokenResponse {
  message?: string;
  access_token?: string;
  access?: string;
  data?: {
    access?: string;
    access_token?: string;
  };
  expires_in?: number;
  expires_at?: number;
}

// ─── Base Query ───────────────────────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  // The API base URL – endpoints already include /api/...
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://6zpmb4x8-8025.inc1.devtunnels.ms",
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
          const { refreshToken } = readAuthCookies();
          if (!refreshToken) {
            throw new Error("No refresh token");
          }

          const refreshResult = await baseQuery(
            {
              url: "/auth/new/token/refresh/",
              method: "POST",
              body: { refresh: refreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const responseData = refreshResult.data as RefreshTokenResponse;
            const newAccessToken =
              responseData.data?.access || responseData.access;

            if (newAccessToken) {
              api.dispatch(
                updateTokens({
                  accessToken: newAccessToken,
                  tokenExpiresAt: responseData.expires_at,
                }),
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
  tagTypes: ["User", "Auth", "Dashboard", "Profile", "Users", "Settings"],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

export const {} = apiSlice;
