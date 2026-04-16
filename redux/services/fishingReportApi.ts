// redux/services/fishingReportApi.ts
import { apiSlice } from "./apiSlice";

export interface FishingReport {
  _id: string;
  user: { _id: string; name: string; avatar?: string; location?: string };
  lake?: { _id: string; name: string; slug: string; state?: string; species?: string[] } | null;
  lakeName: string;
  title: string;
  text: string;
  species: string;
  image?: string;
  tags: string[];
  conditions: {
    temp?: string;
    weather?: string;
    wind?: string;
    waterLevel?: string;
    clarity?: string;
    pressure?: string;
  };
  catchCount: number;
  biggestCatch?: number;
  score: number;
  fishedAt: string;
  likes: number;
  commentCount: number;
  helpfulCount: number;
  status: "active" | "pending" | "rejected" | "flagged";
  featured: boolean;
  isHelpful?: boolean;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  lake?: string;
  lakeId?: string;
  weather?: string;
  clarity?: string;
  waterLevel?: string;
  sortBy?: "fishedAt" | "createdAt" | "catchCount" | "biggestCatch" | "likes" | "score";
  order?: "asc" | "desc";
  user?: string;
  featured?: boolean;
  status?: string;
  _auth?: string;
}

export interface PaginatedReports {
  reports: FishingReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats?: {
    approved: number;
    pending: number;
    total: number;
  };
}

export interface SubmitReportPayload {
  lakeName: string;
  lakeId?: string;
  title?: string;
  text: string;
  species?: string;
  image?: string;
  tags?: string[];
  conditions?: {
    temp?: string;
    weather?: string;
    wind?: string;
    waterLevel?: string;
    clarity?: string;
    pressure?: string;
  };
  catchCount?: number;
  biggestCatch?: number;
  fishedAt?: string;
}

const fishingReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── All reports ─────────────────────────────────────────────────────────
    getReports: builder.query<PaginatedReports, ReportsQueryParams>({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.append(k, String(v));
        });
        return `/reports?${sp.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.reports.map(({ _id }) => ({ type: "Reports" as const, id: _id })),
              { type: "Reports", id: "LIST" },
            ]
          : [{ type: "Reports", id: "LIST" }],
    }),

    // ── Admin reports (permission-protected, all statuses) ─────────────────
    getAdminReports: builder.query<PaginatedReports, ReportsQueryParams>({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.append(k, String(v));
        });
        return `/reports/admin?${sp.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.reports.map(({ _id }) => ({ type: "Reports" as const, id: _id })),
              { type: "Reports", id: "LIST" },
            ]
          : [{ type: "Reports", id: "LIST" }],
    }),

    // ── My reports ──────────────────────────────────────────────────────────
    getMyReports: builder.query<PaginatedReports, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 6 } = {}) => `/reports/my?page=${page}&limit=${limit}`,
      providesTags: [{ type: "MyReports", id: "LIST" }],
    }),

    // ── Single report ───────────────────────────────────────────────────────
    getReportById: builder.query<{ report: FishingReport }, { id: string; _auth?: string }>({
      query: ({ id, _auth }) => {
        const q = _auth ? `?_auth=${_auth}` : "";
        return `/reports/${id}${q}`;
      },
      providesTags: (_r, _e, { id }) => [{ type: "Reports", id }],
    }),

    // ── Lake names for filter ───────────────────────────────────────────────
    getReportLakeNames: builder.query<{ lakes: string[] }, void>({
      query: () => `/reports/lakes`,
      providesTags: ["Reports"],
    }),

    // ── Submit report ───────────────────────────────────────────────────────
    submitReport: builder.mutation<{ report: FishingReport; message: string }, SubmitReportPayload>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, body) => {
        const tags: Array<{ type: "Reports" | "MyReports" | "Lakes"; id: string }> = [
          { type: "Reports", id: "LIST" },
          { type: "MyReports", id: "LIST" },
        ];

        if (body.lakeId) {
          tags.push({ type: "Lakes", id: body.lakeId });
        }

        return tags;
      },
    }),

    uploadReportImage: builder.mutation<{ url: string; message?: string }, FormData>({
      query: (formData) => ({
        url: "/reports/upload-image",
        method: "POST",
        body: formData,
      }),
    }),

    // ── Update report ───────────────────────────────────────────────────────
    updateReport: builder.mutation<{ report: FishingReport }, { id: string; data: Partial<FishingReport> }>({
      query: ({ id, data }) => ({
        url: `/reports/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "MyReports", id: "LIST" },
      ],
    }),

    // ── Delete report ───────────────────────────────────────────────────────
    deleteReport: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/reports/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "MyReports", id: "LIST" },
      ],
    }),

    // ── Toggle helpful ──────────────────────────────────────────────────────
    toggleHelpfulReport: builder.mutation<{ helpfulCount: number; isHelpful: boolean }, string>({
      query: (id) => ({ url: `/reports/${id}/helpful`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Reports", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportsQuery,
  useGetAdminReportsQuery,
  useGetMyReportsQuery,
  useGetReportByIdQuery,
  useGetReportLakeNamesQuery,
  useSubmitReportMutation,
  useUploadReportImageMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useToggleHelpfulReportMutation,
} = fishingReportApi;

export default fishingReportApi;
