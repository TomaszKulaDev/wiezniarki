import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/backend/models/User";

// Interfejs dla użytkownika (uproszczony)
interface UserListItem {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  active: boolean;
  locked: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  profileId?: string;
  loginAttempts?: number;
  lockedUntil?: string;
}

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

interface DatabaseSettings {
  cleanupInterval: number;
  backupEnabled: boolean;
}

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Settings", "DatabaseSettings", "InactiveUsers"],
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
      invalidatesTags: ["Settings", "DatabaseSettings"],
    }),

    getRegistrationStatus: builder.query<{ enabled: boolean }, void>({
      query: () => "settings/registration",
      providesTags: ["Settings"],
    }),
    
    updateRegistrationStatus: builder.mutation<
      { success: boolean; message: string },
      { enabled: boolean }
    >({
      query: (data) => ({
        url: "settings/registration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    
    // Nowe endpointy:
    
    getDatabaseSettings: builder.query<DatabaseSettings, void>({
      query: () => "settings/database",
      providesTags: ["DatabaseSettings"],
    }),

    updateDatabaseSettings: builder.mutation<
      { success: boolean; message: string },
      Partial<DatabaseSettings>
    >({
      query: (settings) => ({
        url: "settings/database",
        method: "POST",
        body: settings,
      }),
      invalidatesTags: ["DatabaseSettings"],
    }),

    getInactiveUsers: builder.query<UserListItem[], void>({
      query: () => "admin/users?inactive=true",
      providesTags: ["InactiveUsers"],
      transformResponse: (response: any) => {
        // Zakładamy, że API zwraca obiekt z polem users
        if (response && Array.isArray(response.users)) {
          // Filtrujemy użytkowników, którzy są nieaktywni (niezweryfikowani lub zablokowani)
          return response.users.filter(
            (user: UserListItem) => !user.verified || user.locked
          );
        }
        // Jeśli nie ma users, zwracamy pustą tablicę
        return [];
      },
    }),

    verifyUser: builder.mutation<
      { success: boolean; message: string },
      string // userId
    >({
      query: (userId) => ({
        url: `admin/users/${userId}`,
        method: "PATCH",
        body: { verified: true },
      }),
      invalidatesTags: ["InactiveUsers"],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetRegistrationStatusQuery,
  useUpdateRegistrationStatusMutation,
  useGetDatabaseSettingsQuery,
  useUpdateDatabaseSettingsMutation,
  useGetInactiveUsersQuery,
  useLazyGetInactiveUsersQuery,
  useVerifyUserMutation,
} = settingsApi;
