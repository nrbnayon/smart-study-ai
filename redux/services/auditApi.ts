import { apiSlice } from "./apiSlice";

export interface AuditLog {
  _id: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target?: {
    name: string;
    email: string;
  };
  targetType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  createdAt: string;
}

export interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/audit-logs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
