// redux/services/bassPornApi.ts
import { apiSlice } from "./apiSlice";

export interface CatchItem {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  lake?: { _id: string; name: string; slug: string } | null;
  lakeName: string;
  species: string;
  weight: number;
  weightUnit: "lbs" | "kg";
  length?: number | null;
  technique: string;
  bait?: string;
  depth?: string;
  description?: string;
  caughtAt: string;
  image: string;
  images?: string[];
  likes: number;
  favouriteCount: number;
  commentCount: number;
  status: "active" | "pending" | "rejected" | "flagged";
  featured: boolean;
  isFavourite?: boolean;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BassPornQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  species?: string;
  lake?: string;
  sortBy?: "createdAt" | "caughtAt" | "weight" | "likes" | "length";
  order?: "asc" | "desc";
  user?: string;
  featured?: boolean;
  status?: string;
  _auth?: string;
}

export interface PaginatedCatches {
  catches: CatchItem[];
  statusCounts?: {
    active: number;
    pending: number;
    total: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const bassPornApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── All catches ────────────────────────────────────────────────────────
    getCatches: builder.query<PaginatedCatches, BassPornQueryParams>({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.append(k, String(v));
        });
        return `/bassporn?${sp.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.catches.map(({ _id }) => ({ type: "BassPorn" as const, id: _id })),
              { type: "BassPorn", id: "LIST" },
            ]
          : [{ type: "BassPorn", id: "LIST" }],
    }),

    // ── Admin management (Guaranteed full data) ──────────────────────────
    getAdminCatches: builder.query<PaginatedCatches, BassPornQueryParams>({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.append(k, String(v));
        });
        return `/bassporn/admin?${sp.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.catches.map(({ _id }) => ({ type: "BassPorn" as const, id: _id })),
              { type: "BassPorn", id: "LIST" },
            ]
          : [{ type: "BassPorn", id: "LIST" }],
    }),

    // ── My catches ─────────────────────────────────────────────────────────
    getMyCatches: builder.query<PaginatedCatches, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 12 } = {}) =>
        `/bassporn/my?page=${page}&limit=${limit}`,
      providesTags: [{ type: "MyCatches", id: "LIST" }],
    }),

    // ── My favourites ──────────────────────────────────────────────────────
    getMyFavouriteCatches: builder.query<PaginatedCatches, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 12 } = {}) =>
        `/bassporn/favourites?page=${page}&limit=${limit}`,
      providesTags: [{ type: "FavouriteCatches", id: "LIST" }],
    }),

    // ── Single catch ───────────────────────────────────────────────────────
    getCatchById: builder.query<{ catch: CatchItem }, string>({
      query: (id) => `/bassporn/${id}`,
      providesTags: (_r, _e, id) => [{ type: "BassPorn", id }],
    }),

    // ── Upload catch ───────────────────────────────────────────────────────
    uploadCatch: builder.mutation<{ catch: CatchItem; message: string }, FormData>({
      query: (formData) => ({
        url: "/bassporn",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "BassPorn", id: "LIST" },
        { type: "MyCatches", id: "LIST" },
      ],
    }),

    // ── Update catch ───────────────────────────────────────────────────────
    updateCatch: builder.mutation<{ catch: CatchItem }, { id: string; data: FormData | Partial<CatchItem> }>({
      query: ({ id, data }) => ({
        url: `/bassporn/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "BassPorn", id },
        { type: "BassPorn", id: "LIST" },
        { type: "MyCatches", id: "LIST" },
      ],
    }),

    // ── Delete catch ───────────────────────────────────────────────────────
    deleteCatch: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/bassporn/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "BassPorn", id },
        { type: "BassPorn", id: "LIST" },
        { type: "MyCatches", id: "LIST" },
        { type: "FavouriteCatches", id: "LIST" },
      ],
    }),

    // ── Like / unlike ──────────────────────────────────────────────────────
    toggleLikeCatch: builder.mutation<{ likes: number; isLiked: boolean }, string>({
      query: (id) => ({ url: `/bassporn/${id}/like`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "BassPorn", id },
        { type: "BassPorn", id: "LIST" },
        { type: "MyCatches", id: "LIST" },
        { type: "FavouriteCatches", id: "LIST" },
      ],
    }),

    // ── Favourite / unfavourite ─────────────────────────────────────────────
    toggleFavouriteCatch: builder.mutation<{ isFavourite: boolean }, string>({
      query: (id) => ({ url: `/bassporn/${id}/favourite`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "BassPorn", id },
        { type: "BassPorn", id: "LIST" },
        { type: "MyCatches", id: "LIST" },
        { type: "FavouriteCatches", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCatchesQuery,
  useGetAdminCatchesQuery,
  useGetMyCatchesQuery,
  useGetMyFavouriteCatchesQuery,
  useGetCatchByIdQuery,
  useUploadCatchMutation,
  useUpdateCatchMutation,
  useDeleteCatchMutation,
  useToggleLikeCatchMutation,
  useToggleFavouriteCatchMutation,
} = bassPornApi;

export default bassPornApi;
