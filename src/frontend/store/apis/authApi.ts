import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  token: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
