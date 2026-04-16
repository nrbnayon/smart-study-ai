// redux/services/contactApi.ts
import { apiSlice } from "../features/apiSlice";

export interface ContactMessage {
  _id: string;
  user?: { _id: string; name: string; avatar?: string; email: string };
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "general" | "bug" | "feature" | "lake_correction" | "catch_dispute" | "account" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: { _id: string; name: string };
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
}

const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Submit public contact form ──────────────────────────────────────────
    submitContact: builder.mutation<{ id: string; status: string; message: string }, ContactFormData>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MyContacts", id: "LIST" }],
    }),

    // ── User's own contact history ──────────────────────────────────────────
    getMyContacts: builder.query<{ contacts: ContactMessage[] }, void>({
      query: () => "/contact/my",
      providesTags: [{ type: "MyContacts", id: "LIST" }],
    }),

    // ── Admin: get all contacts ─────────────────────────────────────────────
    getContacts: builder.query<
      { contacts: ContactMessage[]; pagination: { total: number; page: number; pages: number } },
      { page?: number; limit?: number; status?: string; category?: string; priority?: string; search?: string }
    >({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.append(k, String(v));
        });
        return `/contact?${sp.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.contacts.map(({ _id }) => ({ type: "Contact" as const, id: _id })),
              { type: "Contact", id: "LIST" },
            ]
          : [{ type: "Contact", id: "LIST" }],
    }),

    // ── Admin: get single contact ───────────────────────────────────────────
    getContactById: builder.query<{ contact: ContactMessage }, string>({
      query: (id) => `/contact/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Contact", id }],
    }),

    // ── Admin: update contact status/routing ────────────────────────────────
    updateContact: builder.mutation<
      { contact: ContactMessage; message: string },
      { id: string; data: Partial<ContactMessage> }
    >({
      query: ({ id, data }) => ({
        url: `/contact/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),

    // ── Admin: delete contact ───────────────────────────────────────────────
    deleteContact: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/contact/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitContactMutation,
  useGetMyContactsQuery,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;

export default contactApi;
