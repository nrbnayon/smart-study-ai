import { apiSlice } from "./apiSlice";

export interface AnalyticsResponse {
  userActivity: {
    day: string;
    date: string;
    users: number;
  }[];
  lakePopularity: {
    name: string;
    visits: number;
  }[];
  engagementBreakdown: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, number>({
      query: (range = 30) => `/dashboard/analytics?range=${range}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
export default analyticsApi;
