"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsHydrated,
} from "@/redux/features/authSlice";
import { clearAuthCookies } from "@/lib/authCookies";

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
export function useUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const redUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  const hasRole = (role: string) => redUser?.role === role;

  const logout = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      await fetch(`${apiBase}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue with local cleanup even if backend logout fails.
    }

    dispatch(logoutAction());
    clearAuthCookies();
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
    accessToken: useAppSelector((state) => state.auth.accessToken),
    isAuthenticated,
    isLoading: !isHydrated,
    hasRole,
    logout,
  };
}
