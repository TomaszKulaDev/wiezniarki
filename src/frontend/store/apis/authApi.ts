/* eslint-disable @typescript-eslint/no-empty-object-type */
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

// Funkcja pomocnicza do rotacji tokenów
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

// Zaawansowany baseQuery z automatycznym odświeżaniem tokenów
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Próba odświeżenia tokenów
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // Brak tokenu odświeżającego, użytkownik musi się zalogować ponownie
      return result;
    }

    // Wykonaj zapytanie o nowe tokeny
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Zapisz nowe tokeny
      const { accessToken, refreshToken: newRefreshToken } =
        refreshResult.data as RefreshResponse;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Spróbuj zapytanie ponownie z nowym tokenem
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Odświeżenie nie powiodło się, wyloguj użytkownika
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};

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
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch (error) {
          // Obsługa błędów
        }
      },
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
        body: { refreshToken: localStorage.getItem("refreshToken") },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch (error) {
          // Obsługa błędów
        }
      },
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
