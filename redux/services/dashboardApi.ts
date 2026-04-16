import { apiSlice } from "./apiSlice";

export interface StatMetric {
  value: number;
  trend: number;
}

export interface DashboardStats {
  totalUsers: StatMetric;
  totalLakes: StatMetric;
  totalReports: StatMetric;
  bassPornRequests: StatMetric;
  totalCatches: StatMetric;
  totalReviews: StatMetric;
  totalComments?: StatMetric;
  openContacts: StatMetric;
}

export interface UserActivityData {
  day: string;
  users: number;
}

export interface ReportsSubmittedData {
  week: string;
  reports: number;
}

export interface RecentActivity {
  id: string;
  user: { name: string; avatar: string };
  action: string;
  lake: string;
  time: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  userActivity: UserActivityData[];
  reportsSubmitted: ReportsSubmittedData[];
  recentActivity: RecentActivity[];
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      transformResponse: (res: DashboardResponse) => res,
      providesTags: ["Dashboard"],
    }),
    getDashboardStats: builder.query<{ success: boolean; data: { stats: DashboardStats } }, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery, useGetDashboardStatsQuery } = dashboardApi;

