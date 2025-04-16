import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Stats {
  matches: number;
  messages: number;
  views: number;
  notifications: number;
}

export const statsApi = createApi({
  reducerPath: "statsApi",
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
  tagTypes: ["Stats"],
  endpoints: (builder) => ({
    getUserStats: builder.query<Stats, string>({
      query: (userId) => `stats/${userId}`,
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetUserStatsQuery } = statsApi;
