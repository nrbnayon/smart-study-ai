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
export function useUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutBackend] = useLogoutMutation();

  const redUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  const hasRole = (role: string) => redUser?.role === role;

  const logout = async () => {
    try {
      // Attempt backend logout but don't let it block frontend cleanup
      await logoutBackend().unwrap();
    } catch (error) {
      console.warn("Backend logout failed, proceeding with local cleanup:", error);
    } finally {
      // Forcefully clear all local auth state regardless of backend result
      dispatch(logoutAction());
      clearAuthCookies();
      router.push("/signin");
    }
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
