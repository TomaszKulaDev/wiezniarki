import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderType: "prisoner" | "partner";
  recipientId: string;
  content: string;
  attachments?: string[];
  readStatus: boolean;
  moderationStatus: "pending" | "approved" | "rejected";
  moderationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationPartner {
  id: string;
  name: string;
  image?: string;
  role: string;
}

export interface Conversation {
  matchId: string;
  partnerId: string;
  partnerName: string;
  partnerImg?: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}

export interface PaginatedMessages {
  messages: Message[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Message", "Conversation", "UnreadCount"],
  endpoints: (builder) => ({
    // Pobieranie listy wiadomości dla danego matchu
    getMessages: builder.query<
      PaginatedMessages,
      { matchId: string; limit?: number; offset?: number }
    >({
      query: ({ matchId, limit = 100, offset = 0 }) =>
        `messages?matchId=${matchId}&limit=${limit}&offset=${offset}`,
      // Transformacja odpowiedzi - sortowanie wiadomości rosnąco wg daty
      transformResponse: (response: PaginatedMessages) => {
        // Sortowanie wiadomości od najstarszej do najnowszej
        const sortedMessages = {
          ...response,
          messages: response.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        };
        return sortedMessages;
      },
      // Dłuższe cachowanie
      keepUnusedDataFor: 60, // 60 sekund
      providesTags: (result) =>
        result?.messages
          ? [
              ...result.messages.map(({ id }) => ({
                type: "Message" as const,
                id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
    }),

    // Pobieranie pojedynczej wiadomości
    getMessage: builder.query<Message, string>({
      query: (id) => `messages/${id}`,
      providesTags: (_, __, id) => [{ type: "Message", id }],
    }),

    // Wysyłanie nowej wiadomości
    sendMessage: builder.mutation<
      { message: string; data: Message },
      {
        matchId: string;
        recipientId: string;
        content: string;
        attachments?: string[];
      }
    >({
      query: (messageData) => ({
        url: "messages",
        method: "POST",
        body: messageData,
      }),
      invalidatesTags: [
        { type: "Message", id: "LIST" },
        { type: "Conversation", id: "LIST" },
        { type: "UnreadCount", id: "COUNT" },
      ],
    }),

    // Oznaczanie wiadomości jako przeczytanej
    markAsRead: builder.mutation<
      { message: string; readStatus: boolean },
      string
    >({
      query: (id) => ({
        url: `messages/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Message", id },
        { type: "UnreadCount", id: "COUNT" },
      ],
    }),

    // Usuwanie wiadomości
    deleteMessage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Message", id },
        { type: "Message", id: "LIST" },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    // Pobieranie konwersacji użytkownika
    getConversations: builder.query<{ conversations: Conversation[] }, void>({
      query: () => "messages/conversations",
      providesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    // Pobieranie liczby nieprzeczytanych wiadomości
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "messages/unread-count",
      providesTags: [{ type: "UnreadCount", id: "COUNT" }],
    }),
  }),
});

// Eksport hooków wygenerowanych automatycznie
export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
  useGetConversationsQuery,
  useGetUnreadCountQuery,
} = messageApi;
