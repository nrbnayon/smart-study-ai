import { apiSlice } from "../features/apiSlice";

export interface SystemSettings {
  autoApproveMode: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  maintenanceMode: boolean;
  privacyPolicy: string;
  termsOfService: string;
  lastUpdatedBy?: string | { _id: string; name: string };
  updatedAt?: string;
}

export interface LegalResponse {
  success: boolean;
  data: {
    privacyPolicy: string;
    termsOfService: string;
    updatedAt: string;
  };
}

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ success: boolean; data: SystemSettings }, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<{ success: boolean; data: SystemSettings }, Partial<SystemSettings>>({
      query: (data) => ({
        url: "/settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    getLegalDocs: builder.query<LegalResponse, void>({
      query: () => ({
        url: "/settings/legal",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
  }),
});

export const { 
  useGetSettingsQuery, 
  useUpdateSettingsMutation,
  useGetLegalDocsQuery 
} = settingsApi;
