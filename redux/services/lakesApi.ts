// redux/services/lakesApi.ts
import { apiSlice } from "./apiSlice";

export interface LakeConditions {
  temp?: string;
  weather?: string;
  wind?: string;
  clarity?: "Clear" | "Stained" | "Muddy" | "";
  waterLevel?: "Normal" | "High" | "Low" | "Rising" | "Falling" | "";
  pressure?: "Stable" | "Rising" | "Falling" | "";
  condition?: "Excellent" | "Good" | "Fair" | "Poor" | "";
}

export interface Lake {
  _id: string;
  name: string;
  slug: string;
  state: string;
  description: string;
  size: number;
  elevation?: number;
  maxDepth?: number;
  avgDepth?: number;
  catchRate: number;
  recordBass: number;
  species: string[];
  topTechniques?: string[];
  bestSeason?: string;
  nearestCity?: string;
  image: string;
  images?: string[];
  color: string;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  reportCount: number;
  catchCount: number;
  favouriteCount: number;
  conditions: LakeConditions;
  facilities?: {
    boatRamp?: boolean;
    marina?: boolean;
    camping?: boolean;
    fishingPier?: boolean;
    baitShop?: boolean;
  };
  seasonalPatterns?: Array<{
    season: string;
    techniques: string[];
    bestTimes: string;
    depthRange: string;
    notes: string;
  }>;
  status: "active" | "pending" | "rejected" | "closed";
  featured: boolean;
  isFavourite?: boolean;
  submittedBy?: { _id: string; name: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

export interface LakeReview {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  text: string;
  title?: string;
  helpfulCount: number;
  status: string;
  createdAt: string;
}

export interface LakesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  species?: string;
  condition?: string;
  clarity?: string;
  minRating?: number;
  sortBy?: "rating" | "name" | "size" | "catchRate" | "createdAt";
  order?: "asc" | "desc";
  featured?: boolean;
  status?: string;
  _auth?: string;
}

export interface PaginatedLakes {
  lakes: Lake[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReviewsResponse {
  reviews: LakeReview[];
  userReview: LakeReview | null;
  pagination: { page: number; limit: number; total: number; pages: number };
  stats: { avgRating: number; totalReviews: number };
}

export interface LakeReportItem {
  _id: string;
  title?: string;
  text: string;
  species?: string;
  image?: string;
  tags?: string[];
  score?: number;
  catchCount?: number;
  biggestCatch?: number;
  fishedAt: string;
  lakeName?: string;
  lake?: {
    _id: string;
    name?: string;
    slug?: string;
    species?: string[];
  };
  conditions?: {
    temp?: string;
    weather?: string;
    waterLevel?: string;
    clarity?: string;
    pressure?: string;
  };
  user?: {
    _id: string;
    name?: string;
    avatar?: string;
  };
  status?: "active" | "pending" | "rejected" | "flagged";
}

const lakesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Featured / landing page lakes ─────────────────────────────────────
    getFeaturedLakes: builder.query<{ lakes: Lake[] }, { limit?: number; _auth?: string }>({
      query: ({ limit = 12, _auth } = {}) => {
        const q = new URLSearchParams({ limit: String(limit) });
        if (_auth) q.append("_auth", _auth);
        return `/lakes/featured?${q.toString()}`;
      },
      providesTags: [{ type: "Lakes", id: "FEATURED" }],
    }),

    // ── All lakes (paginated, filterable) ─────────────────────────────────
    getLakes: builder.query<PaginatedLakes, LakesQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== "")
            searchParams.append(key, String(val));
        });
        return `/lakes?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.lakes.map(({ _id }) => ({
                type: "Lakes" as const,
                id: _id,
              })),
              { type: "Lakes", id: "LIST" },
            ]
          : [{ type: "Lakes", id: "LIST" }],
    }),

    // ── Single lake by ID or slug ──────────────────────────────────────────
    getLakeById: builder.query<{ lake: Lake }, { id: string; _auth?: string }>({
      query: ({ id, _auth }) => {
        const q = _auth ? `?_auth=${_auth}` : "";
        return `/lakes/${id}${q}`;
      },
      providesTags: (result, _err, { id }) => {
        const tags: Array<{ type: "Lakes"; id: string }> = [{ type: "Lakes", id }];
        if (result?.lake?._id && result.lake._id !== id) {
          tags.push({ type: "Lakes", id: result.lake._id });
        }
        return tags;
      },
    }),

    // ── Create lake ────────────────────────────────────────────────────────
    createLake: builder.mutation<{ lake: Lake; message: string }, FormData>({
      query: (formData) => ({
        url: "/lakes",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Lakes", id: "LIST" },
        { type: "Lakes", id: "FEATURED" },
      ],
    }),

    // ── Update lake (admin) ────────────────────────────────────────────────
    updateLake: builder.mutation<
      { lake: Lake },
      { id: string; data: FormData | Partial<Lake> }
    >({
      query: ({ id, data }) => ({
        url: `/lakes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Lakes", id },
        { type: "Lakes", id: "LIST" },
        { type: "Lakes", id: "FEATURED" },
      ],
    }),

    // ── Update lake status (approve/reject) ────────────────────────────────
    updateLakeStatus: builder.mutation<
      { lake: Lake },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/lakes/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Lakes", id },
        { type: "Lakes", id: "LIST" },
      ],
    }),

    // ── Delete lake ────────────────────────────────────────────────────────
    deleteLake: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/lakes/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Lakes", id },
        { type: "Lakes", id: "LIST" },
        { type: "Lakes", id: "FEATURED" },
      ],
    }),

    // ── Toggle favourite ───────────────────────────────────────────────────
    toggleFavouriteLake: builder.mutation<{ isFavourite: boolean }, string>({
      query: (id) => ({ url: `/lakes/${id}/favourite`, method: "POST" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Lakes", id },
        { type: "Lakes", id: "FAVOURITES" },
      ],
    }),

    // ── My favourite lakes ────────────────────────────────────────────────
    getMyFavouriteLakes: builder.query<PaginatedLakes, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 12 } = {}) =>
        `/lakes/favourites?page=${page}&limit=${limit}`,
      providesTags: [{ type: "Lakes", id: "FAVOURITES" }],
    }),

    // ── Lake reviews ───────────────────────────────────────────────────────
    getLakeReviews: builder.query<
      ReviewsResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) =>
        `/lakes/${id}/reviews?page=${page}&limit=${limit}`,
      providesTags: (_result, _err, { id }) => [{ type: "LakeReviews", id }],
    }),

    submitLakeReview: builder.mutation<
      { review: LakeReview },
      { id: string; rating: number; text: string; title?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/lakes/${id}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "LakeReviews", id },
        { type: "Lakes", id },
      ],
    }),

    deleteLakeReview: builder.mutation<
      { message: string },
      { lakeId: string; reviewId: string }
    >({
      query: ({ lakeId, reviewId }) => ({
        url: `/lakes/${lakeId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { lakeId }) => [
        { type: "LakeReviews", id: lakeId },
        { type: "Lakes", id: lakeId },
      ],
    }),

    // ── Lake reports ───────────────────────────────────────────────────────
    getLakeReports: builder.query<
      {
        reports: LakeReportItem[];
        pagination: { page: number; limit: number; total: number; pages: number };
      },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 6 }) =>
        `/lakes/${id}/reports?page=${page}&limit=${limit}`,
      providesTags: (_result, _err, { id }) => [{ type: "LakeReports", id }],
    }),
    // ── Unique lake names ───────────────────────────────────────────────────
    getLakeNames: builder.query<{ lakes: string[] }, void>({
      query: () => "/lakes/names",
      providesTags: [{ type: "Lakes", id: "NAMES" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFeaturedLakesQuery,
  useGetLakesQuery,
  useGetLakeByIdQuery,
  useCreateLakeMutation,
  useUpdateLakeMutation,
  useUpdateLakeStatusMutation,
  useDeleteLakeMutation,
  useToggleFavouriteLakeMutation,
  useGetLakeReviewsQuery,
  useSubmitLakeReviewMutation,
  useDeleteLakeReviewMutation,
  useGetLakeReportsQuery,
  useGetLakeNamesQuery,
  useGetMyFavouriteLakesQuery,
} = lakesApi;

export default lakesApi;
