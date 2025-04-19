import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
  };
  registration: {
    enabled: boolean;
    requireVerification: boolean;
  };
  database: {
    cleanupInterval: number;
    backupEnabled: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    adminEmail: string;
  };
}

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSystemSettings: builder.query<SystemSettings, void>({
      query: () => "admin/settings",
      providesTags: ["Settings"],
    }),

    updateSystemSettings: builder.mutation<
      { success: boolean; message: string },
      Partial<SystemSettings>
    >({
      query: (settings) => ({
        url: "admin/settings",
        method: "POST",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),

    getRegistrationStatus: builder.query<{ enabled: boolean }, void>({
      query: () => "settings/registration",
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetRegistrationStatusQuery,
} = settingsApi;
