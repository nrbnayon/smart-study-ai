// redux/features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface User {
  name: string;
  email: string;
  role: string | "admin" | "user";
  avatar?: string | null;
  phone?: string;
  location?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}



const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};



export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    updateTokens: (state, action: PayloadAction<{ accessToken: string; tokenExpiresAt?: number }>) => {
      state.accessToken = action.payload.accessToken;
    },

    // Sync profile changes (name, avatar, phone, location) into auth state
    updateProfile: (
      state,
      action: PayloadAction<Partial<Pick<User, 'name' | 'avatar' | 'phone' | 'location'>>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateTokens, updateProfile } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
