/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../features/apiSlice";
import { User, UserApiResponse, UserListApiResponse } from "../../types/users";

export interface GetUsersParams {
  search?: string;
  subscription_status?: string;
  account_status?: string;
  page?: number;
}

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    // ── Admin: list / CRUD ───────────────────────────────────────────────────

    getAllUsers: builder.query<
      UserListApiResponse["data"]["data"],
      GetUsersParams
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.set("search", params.search);
        if (params.subscription_status)
          searchParams.set("subscription_status", params.subscription_status);
        if (params.account_status)
          searchParams.set("account_status", params.account_status);
        if (params.page) searchParams.set("page", String(params.page));
        const qs = searchParams.toString();
        return `/adminapp/users/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: UserListApiResponse) => {
        // Flatten triple nesting: response.data.data
        return response?.data?.data as any;
      },
      providesTags: (result) =>
        (result as any)?.results
          ? [
              ...(result as any).results.map(({ id }: { id: string }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/adminapp/users/${id}/`,
      transformResponse: (response: UserApiResponse) => {
        return response?.data?.data as any;
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUserById: builder.mutation<User, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/adminapp/users/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: UserApiResponse) => {
        return response?.data?.data as any;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/adminapp/users/${id}/`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "User", id: "LIST" }],
      },
    ),

    createUser: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: "/adminapp/users/",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: UserApiResponse) => {
        return response?.data?.data as any;
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUserSubscription: builder.mutation<
      User,
      { id: string; data: { current_plan: string } }
    >({
      query: ({ id, data }) => ({
        url: `/adminapp/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: UserApiResponse) => {
        return response?.data?.data as any;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserSubscriptionMutation,
} = userApi;
