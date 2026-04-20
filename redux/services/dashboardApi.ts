import { apiSlice } from "../features/apiSlice";
import { DashboardApiResponse } from "../../types/dashboard.types";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardApiResponse["data"], void>({
      query: () => "/adminapp/dashboard/",
      transformResponse: (response: DashboardApiResponse) => response.data,
      providesTags: ["Dashboard"],
    }),
    getDashboardStats: builder.query<DashboardApiResponse["data"], void>({
      query: () => "/adminapp/dashboard/",
      transformResponse: (response: DashboardApiResponse) => response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery, useGetDashboardStatsQuery } = dashboardApi;


