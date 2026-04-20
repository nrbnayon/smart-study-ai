/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/services/authApi.ts
import { apiSlice } from "../features/apiSlice";

interface SigninRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SigninResponse {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  permissions?: string[];
  accessToken: string;
  refreshToken: string;
}

interface SigninApiUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  avatar?: string | null;
  permissions?: string[];
}

interface SigninApiData {
  access: string;
  refresh: string;
  user?: SigninApiUser;
}

interface SigninApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SigninApiData;
  timestamp?: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  email: string;
  status: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  verified: boolean;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

interface ProfileApiData {
  id: string;
  email: string;
  name: string;
  image_url: string;
  description: string;
  problems_solved: number;
  study_minutes: number;
  active_days: number;
  two_factor_enabled: boolean;
  badges: any[];
  level: number;
  created_at: string;
  updated_at: string;
  role?: string; // Adding optional role if backend provides it in profile
}

interface ProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProfileApiData;
  timestamp: string;
}

// Inject endpoints into the API slice
export const authApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    // Signin endpoint
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: SigninApiResponse): SigninResponse => {
        const payload = response?.data;

        return {
          id: payload?.user?.id,
          accessToken: payload?.access || "",
          refreshToken: payload?.refresh || "",
          role: payload?.user?.role || "user",
          name: payload?.user?.name || "User",
          email: payload?.user?.email || "",
          avatar: payload?.user?.avatar ?? null,
          permissions: payload?.user?.permissions || [],
        };
      },
      invalidatesTags: ["Auth"],
    }),

    // Signup endpoint
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify OTP endpoint
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (otpData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user - profile
    getCurrentUser: builder.query<ProfileApiResponse, void>({
      query: () => "/profile/",
      providesTags: ["Auth"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSigninMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;
