import { apiSlice } from "../features/apiSlice";
import {
  ActiveUsersApiResponse,
  PopularSubjectsApiResponse,
} from "../../types/analytics";

export const analyticsApi = apiSlice.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getPopularSubjects: builder.query<PopularSubjectsApiResponse["data"]["popular_subjects"], void>({
      query: () => "/adminapp/analytics/popular-subjects/",
      transformResponse: (response: PopularSubjectsApiResponse) => {
        return response?.data?.popular_subjects || [];
      },
      providesTags: ["Analytics"],
    }),
    getActiveUsersAnalytics: builder.query<ActiveUsersApiResponse["data"], void>({
      query: () => "/adminapp/analytics/active-users/",
      transformResponse: (response: ActiveUsersApiResponse) => {
        return response?.data;
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetPopularSubjectsQuery, useGetActiveUsersAnalyticsQuery } = analyticsApi;
