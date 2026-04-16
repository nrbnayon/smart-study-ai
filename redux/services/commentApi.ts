// redux/services/commentApi.ts
import { apiSlice } from "./apiSlice";

export interface Comment {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  targetType: "catch" | "report" | "lake";
  catch?: string;
  report?: string;
  lake?: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  replyCount: number;
  parent?: string;
  edited: boolean;
  editedAt?: string;
  status: "active" | "flagged" | "deleted";
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Get comments for target ─────────────────────────────────────────────
    getComments: builder.query<
      CommentsResponse,
      { targetType: string; targetId: string; page?: number; limit?: number; parent?: string }
    >({
      query: ({ targetType, targetId, page = 1, limit = 10, parent }) => {
        let url = `/comments?targetType=${targetType}&targetId=${targetId}&page=${page}&limit=${limit}`;
        if (parent) url += `&parent=${parent}`;
        return url;
      },
      providesTags: (result, _e, arg) =>
        result
          ? [
              ...result.comments.map(({ _id }) => ({ type: "Comments" as const, id: _id })),
              { type: "Comments", id: `TARGET_${arg.targetType}_${arg.targetId}` },
            ]
          : [{ type: "Comments", id: `TARGET_${arg.targetType}_${arg.targetId}` }],
    }),

    // ── Post comment ────────────────────────────────────────────────────────
    postComment: builder.mutation<
      { comment: Comment },
      { targetType: string; targetId: string; text: string; parentId?: string }
    >({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Comments", id: `TARGET_${arg.targetType}_${arg.targetId}` },
        // Since comment counts update on targets, we invalidate the target document too
        { type: arg.targetType === "catch" ? "BassPorn" : arg.targetType === "lake" ? "Lakes" : "Reports", id: arg.targetId },
      ],
    }),

    // ── Update comment ──────────────────────────────────────────────────────
    updateComment: builder.mutation<{ comment: Comment }, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Comments", id }],
    }),

    // ── Delete comment ──────────────────────────────────────────────────────
    deleteComment: builder.mutation<{ message: string }, { id: string; targetType: string; targetId: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Comments", id: arg.id },
        { type: "Comments", id: `TARGET_${arg.targetType}_${arg.targetId}` },
        { type: arg.targetType === "catch" ? "BassPorn" : arg.targetType === "lake" ? "Lakes" : "Reports", id: arg.targetId },
      ],
    }),

    // ── Toggle like ─────────────────────────────────────────────────────────
    toggleLikeComment: builder.mutation<{ likes: number; isLiked: boolean }, string>({
      query: (id) => ({ url: `/comments/${id}/like`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Comments", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  usePostCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeCommentMutation,
} = commentApi;

export default commentApi;
