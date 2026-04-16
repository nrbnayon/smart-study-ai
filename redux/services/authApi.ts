// redux/services/authApi.ts
import { apiSlice } from "../features/apiSlice";

interface SigninRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SigninResponse {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  permissions?: string[];
  accessToken: string;
  refreshToken: string;
}

type SigninProfileFields = Pick<
  SigninResponse,
  "name" | "email" | "avatar" | "permissions"
>;

interface SigninApiData extends Partial<SigninProfileFields> {
  access_token: string;
  refresh_token: string;
  user_role: string;
}

interface SigninApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: SigninApiData;
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

// Inject endpoints into the API slice
export const authApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    // Signin endpoint
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: SigninApiResponse): SigninResponse => {
        const payload = response?.data;

        return {
          accessToken: payload?.access_token || "",
          refreshToken: payload?.refresh_token || "",
          role: payload?.user_role || "user",
          name: payload?.name || "User",
          email: payload?.email || "",
          avatar: payload?.avatar ?? null,
          permissions: payload?.permissions || [],
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

    // Get current user - profile (it can be profile, me, get user, etc. depending on your backend)
    getCurrentUser: builder.query<unknown, void>({
      query: () => "/auth/me",
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
