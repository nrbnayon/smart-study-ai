import { apiSlice } from "../features/apiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: string[];
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileStats {
  catches: number;
  biggestCatch: number;
  totalWeight: number;
  favorites: number;
  reports: number;
}

export interface ProfileLake {
  _id: string;
  name: string;
  slug?: string;
  state: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  species?: string[];
  isFavourite?: boolean;
}

export interface ProfileCatch {
  _id: string;
  species: string;
  image: string;
  weight: number;
  weightUnit: "lbs" | "kg";
  length?: number | null;
  technique?: string;
  status: "active" | "pending" | "rejected" | "flagged";
}

export interface ProfileData extends User {
  stats?: ProfileStats;
  favouriteLakes?: ProfileLake[];
  myCatches?: ProfileCatch[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  location?: string;
  avatar?: File;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AdminUpdateUserPayload {
  id: string;
  name?: string;
  role?: string;
  status?: string;
  permissions?: string[];
  phone?: string;
  location?: string;
}

export interface SystemSettings {
  _id?: string;
  key?: string;
  autoApproveMode: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  maintenanceMode: boolean;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    // ── Own profile ──────────────────────────────────────────────────────────

    getMyProfile: builder.query<ApiResponse<ProfileData>, void>({
      query: () => "/auth/me",
      providesTags: [{ type: "User", id: "ME" }],
    }),

    updateMyProfile: builder.mutation<ApiResponse<User>, FormData>({
      query: (formData) => ({
        url: "/auth/me",
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "/auth/me/change-password",
        method: "PUT",
        body,
      }),
    }),

    // ── Admin: list / CRUD ───────────────────────────────────────────────────

    getAllUsers: builder.query<PaginatedApiResponse<User>, GetUsersParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.set("search", params.search);
        if (params.role) searchParams.set("role", params.role);
        if (params.status) searchParams.set("status", params.status);
        if (params.page) searchParams.set("page", String(params.page));
        if (params.limit) searchParams.set("limit", String(params.limit));
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
        const qs = searchParams.toString();
        return `/users${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "User" as const,
                id: _id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUserById: builder.mutation<ApiResponse<User>, AdminUpdateUserPayload>(
      {
        query: ({ id, ...body }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "User", id },
          { type: "User", id: "LIST" },
        ],
      },
    ),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    createUser: builder.mutation<
      ApiResponse<User>,
      Partial<User> & { password: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ── Admin: System Settings ───────────────────────────────────────────────

    getSystemSettings: builder.query<ApiResponse<SystemSettings>, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    updateSystemSettings: builder.mutation<
      ApiResponse<SystemSettings>,
      Partial<SystemSettings>
    >({
      query: (body) => ({
        url: "/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = userApi;
