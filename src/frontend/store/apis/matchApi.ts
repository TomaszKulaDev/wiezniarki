import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Match {
  id: string;
  prisonerId: string;
  partnerId: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
  initiatedBy: "prisoner" | "partner";
  matchScore: number;
  matchReason: string[];
  messageCount: number;
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchPartner {
  id: string;
  name: string;
  image?: string;
  role: string;
  profile: {
    age: number;
    interests: string[];
    bio: string;
  };
}

export interface MatchRecommendation {
  id: string; // ID profilu
  name: string;
  age: number;
  interests: string[];
  score: number;
  reasons: string[];
  photoUrl?: string;
}

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Match", "MatchList", "Recommendation"],
  endpoints: (builder) => ({
    // Pobieranie wszystkich dopasowań użytkownika
    getUserMatches: builder.query<Match[], void>({
      query: () => "matches",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Match" as const, id })),
              { type: "MatchList", id: "LIST" },
            ]
          : [{ type: "MatchList", id: "LIST" }],
    }),

    // Pobieranie pojedynczego dopasowania
    getMatch: builder.query<Match, string>({
      query: (id) => `matches/${id}`,
      providesTags: (_, __, id) => [{ type: "Match", id }],
    }),

    // Pobieranie informacji o partnerze dla danego dopasowania
    getMatchPartner: builder.query<{ partner: MatchPartner }, string>({
      query: (matchId) => `matches/${matchId}/partner`,
      providesTags: (_, __, matchId) => [{ type: "Match", id: matchId }],
    }),

    // Tworzenie nowego dopasowania
    createMatch: builder.mutation<Match, { partnerId: string }>({
      query: (data) => ({
        url: "matches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "MatchList", id: "LIST" }],
    }),

    // Aktualizacja statusu dopasowania
    updateMatchStatus: builder.mutation<
      Match,
      { matchId: string; status: Match["status"] }
    >({
      query: ({ matchId, status }) => ({
        url: `matches/${matchId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_, __, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "MatchList", id: "LIST" },
      ],
    }),

    // Pobieranie rekomendowanych partnerów
    getRecommendedPartners: builder.query<MatchRecommendation[], void>({
      query: () => "matches/recommendations",
      providesTags: [{ type: "Recommendation", id: "LIST" }],
    }),
  }),
});

// Eksport hooków wygenerowanych automatycznie
export const {
  useGetUserMatchesQuery,
  useGetMatchQuery,
  useGetMatchPartnerQuery,
  useCreateMatchMutation,
  useUpdateMatchStatusMutation,
  useGetRecommendedPartnersQuery,
} = matchApi;
