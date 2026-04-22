/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../features/apiSlice";
import {
  AdminProfile,
  AdminProfileApiResponse,
  TermsSummaryApiResponse,
  TermsSection,
} from "../../types/settings";

export const settingsApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    // Admin Profile
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => "/adminapp/me/",
      transformResponse: (response: AdminProfileApiResponse) => response.data,
      providesTags: ["AdminProfile"],
    }),
    updateAdminProfile: builder.mutation<AdminProfile, FormData>({
      query: (formData) => ({
        url: "/adminapp/me/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["AdminProfile"],
    }),
    resetAdminPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/adminapp/me/reset-password/",
        method: "POST",
        body: data,
      }),
    }),

    // Terms and Conditions
    getTermsAndConditions: builder.query<TermsSummaryApiResponse["data"], void>({
      query: () => "/adminapp/terms/",
      transformResponse: (response: TermsSummaryApiResponse) => response.data,
      providesTags: ["Terms"],
    }),
    createTermsSections: builder.mutation<TermsSection[], { sections: any[] }>({
      query: (data) => ({
        url: "/adminapp/terms/sections/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Terms"],
    }),
    updateTermsSection: builder.mutation<TermsSection, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/adminapp/terms/sections/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Terms"],
    }),
    deleteTermsSection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/adminapp/terms/sections/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useResetAdminPasswordMutation,
  useGetTermsAndConditionsQuery,
  useCreateTermsSectionsMutation,
  useUpdateTermsSectionMutation,
  useDeleteTermsSectionMutation,
} = settingsApi;
