"use client";

import { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConversationList from "@/frontend/components/messages/ConversationList";
import { useGetConversationsQuery } from "@/frontend/store/apis/messageApi";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";

interface Conversation {
  matchId: string;
  partnerId: string;
  partnerName: string;
  partnerImg?: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Pobieranie konwersacji z RTK Query
  const {
    data: conversationsData,
    isLoading: isConversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useGetConversationsQuery(undefined, {
    // Pomiń zapytanie jeśli użytkownik nie jest zalogowany
    skip: !user,
  });

  useEffect(() => {
    // Przekieruj, jeśli użytkownik nie jest zalogowany
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  const isLoading = userLoading || isConversationsLoading;
  const conversations = conversationsData?.conversations || [];
  const error = conversationsError
    ? "Wystąpił błąd podczas ładowania konwersacji"
    : null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-600">Ładowanie wiadomości...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={() => refetchConversations()}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Spróbuj ponownie</span>
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Breadcrumbs pageName="Wiadomości" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Wiadomości
          </h1>
          <p className="text-gray-600">
            Twoje konwersacje i komunikacja z innymi użytkownikami
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {conversations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Brak wiadomości
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Nie masz jeszcze żadnych konwersacji. Zacznij przeglądać
                    profile i nawiąż nowe kontakty.
                  </p>
                  <Link
                    href="/profiles"
                    className="inline-flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    <span>Przeglądaj profile</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Lista konwersacji */}
                  <div className="md:col-span-1 border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Twoje konwersacje
                        </h2>
                        <span className="text-sm text-gray-500">
                          {conversations.length}{" "}
                          {conversations.length === 1
                            ? "konwersacja"
                            : "konwersacji"}
                        </span>
                      </div>
                    </div>
                    <ConversationList
                      conversations={conversations}
                      selectedMatchId={selectedMatchId}
                      onSelectConversation={(matchId) => {
                        setSelectedMatchId(matchId);
                        router.push(`/dashboard/messages/${matchId}`);
                      }}
                    />
                  </div>

                  {/* Widok konwersacji */}
                  <div className="md:col-span-2 flex flex-col h-[600px]">
                    {!selectedMatchId ? (
                      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                        <div className="text-center max-w-md">
                          <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Wybierz konwersację
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Wybierz konwersację z listy po lewej stronie, aby
                            zobaczyć wiadomości
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Nagłówek konwersacji */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => setSelectedMatchId(null)}
                              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg font-medium text-gray-600">
                                  {conversations
                                    .find((c) => c.matchId === selectedMatchId)
                                    ?.partnerName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {
                                    conversations.find(
                                      (c) => c.matchId === selectedMatchId
                                    )?.partnerName
                                  }
                                </h3>
                                <p className="text-sm text-gray-500">Online</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Miejsce na wiadomości */}
                        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                          <div className="space-y-4">
                            {/* Tu będą renderowane wiadomości */}
                            <div className="flex justify-center">
                              <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                                Początek konwersacji
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Formularz wysyłania wiadomości */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="flex space-x-4">
                            <input
                              type="text"
                              placeholder="Napisz wiadomość..."
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                            <button
                              type="button"
                              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center space-x-2"
                            >
                              <span>Wyślij</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
