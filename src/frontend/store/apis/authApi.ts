import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { User } from "@/backend/models/User";

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  role: User["role"];
};

type AuthResponse = {
  user: Omit<User, "passwordHash">;
  accessToken: string;
  refreshToken: string;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

// Funkcja pomocnicza do obsługi zapytań bez localStorage
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  // Credentials: 'include' automatycznie dołącza ciasteczka do żądań
  credentials: "include",
});

// Definiujemy typy dla endpointów, aby uniknąć błędów TypeScript
interface AuthEndpointsTypes {
  login: {
    mutation: {
      request: LoginCredentials;
      response: AuthResponse;
    };
  };
  register: {
    mutation: {
      request: RegisterData;
      response: AuthResponse;
    };
  };
  getCurrentUser: {
    query: {
      response: Omit<User, "passwordHash">;
    };
  };
  logout: {
    mutation: {
      response: { success: boolean };
    };
  };
  refresh: {
    mutation: {
      request: string;
      response: RefreshResponse;
    };
  };
  updateProfileLink: {
    mutation: {
      request: { userId: string; profileId: string };
      response: { message: string };
    };
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),

    getCurrentUser: builder.query<Omit<User, "passwordHash">, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    refresh: builder.mutation<RefreshResponse, string>({
      query: (refreshToken) => ({
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    updateProfileLink: builder.mutation<
      { message: string },
      { userId: string; profileId: string }
    >({
      query: (data) => ({
        url: "auth/update-profile-link",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useRefreshMutation,
  useUpdateProfileLinkMutation,
} = authApi;
