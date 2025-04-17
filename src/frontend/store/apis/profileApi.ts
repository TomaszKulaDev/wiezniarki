import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Profile } from "@/backend/models/Profile";

type ProfileSearchParams = {
  minAge?: number;
  maxAge?: number;
  facility?: string;
  interests?: string[];
  skills?: string[];
  page?: number;
  limit?: number;
};

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Pobieranie wszystkich profili z opcją filtrowania
    getProfiles: builder.query<Profile[], ProfileSearchParams | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Sprawdzamy, czy params jest obiektem
        if (params && typeof params === "object") {
          if ("minAge" in params && params.minAge !== undefined)
            queryParams.append("minAge", params.minAge.toString());
          if ("maxAge" in params && params.maxAge !== undefined)
            queryParams.append("maxAge", params.maxAge.toString());
          if ("facility" in params && params.facility)
            queryParams.append("facility", params.facility);
          if ("interests" in params && params.interests)
            queryParams.append("interests", params.interests.join(","));
          if ("page" in params && params.page !== undefined)
            queryParams.append("page", params.page.toString());
          if ("limit" in params && params.limit !== undefined)
            queryParams.append("limit", params.limit.toString());
        }

        return `profiles?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Profile" as const, id })),
              { type: "Profile", id: "LIST" },
            ]
          : [{ type: "Profile", id: "LIST" }],
    }),

    // Pobieranie pojedynczego profilu po ID
    getProfileById: builder.query<Profile, string>({
      query: (id) => `profiles/${id}`,
      providesTags: (_, __, id) => [{ type: "Profile", id }],
    }),

    // Aktualizacja profilu
    updateProfile: builder.mutation<Profile, Partial<Profile> & { id: string }>(
      {
        query: ({ id, ...data }) => ({
          url: `profiles/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "Profile", id },
          { type: "Profile", id: "LIST" },
        ],
      }
    ),

    createProfile: builder.mutation<
      Profile,
      Omit<Profile, "id" | "createdAt" | "updatedAt">
    >({
      query: (profileData) => ({
        url: "profiles",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: [{ type: "Profile", id: "LIST" }],
    }),

    // Dodaj mutation do usuwania profilu
    deleteProfile: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `profiles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Profile", id },
        { type: "Profile", id: "LIST" },
      ],
    }),
  }),
});

// Export hooków wygenerowanych automatycznie
export const {
  useGetProfilesQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useCreateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
