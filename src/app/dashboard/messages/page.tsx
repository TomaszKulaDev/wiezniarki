"use client";

import { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConversationList from "@/frontend/components/messages/ConversationList";

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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  useEffect(() => {
    // Przekieruj, jeśli użytkownik nie jest zalogowany
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/messages/conversations");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać konwersacji");
      }

      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Błąd pobierania konwersacji:", error);
      setError(
        "Wystąpił błąd podczas ładowania konwersacji. Spróbuj odświeżyć stronę."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchConversations}
          className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wiadomości</h1>
        {conversations.length > 0 && (
          <button
            onClick={() => setSelectedMatchId(null)}
            className="text-primary hover:underline"
          >
            Wszystkie konwersacje
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-gray-400"
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
          <h2 className="text-xl font-semibold mb-2">Brak wiadomości</h2>
          <p className="text-gray-600 mb-6">
            Nie masz jeszcze żadnych konwersacji. Przeglądaj profile i nawiąż
            kontakt.
          </p>
          <Link
            href="/profiles"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Przeglądaj profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista konwersacji */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
            <ConversationList
              conversations={conversations}
              selectedMatchId={selectedMatchId}
              onSelectConversation={(matchId) => setSelectedMatchId(matchId)}
            />
          </div>

          {/* Widok konwersacji */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            {selectedMatchId ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  {/* Nagłówek konwersacji */}
                  <h2 className="font-semibold">
                    {conversations.find((c) => c.matchId === selectedMatchId)
                      ?.partnerName || "Konwersacja"}
                  </h2>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                  {/* Tu będą wiadomości */}
                  <p className="text-center text-gray-500 my-8">
                    Wybierz konwersację z listy, aby zobaczyć wiadomości
                  </p>
                </div>

                <div className="p-4 border-t">
                  {/* Formularz wysyłania wiadomości */}
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Napisz wiadomość..."
                      className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark">
                      Wyślij
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Wiadomości są moderowane przed dostarczeniem do odbiorcy
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-4 text-gray-300"
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
                  <p className="text-gray-600">
                    Wybierz konwersację z listy, aby zobaczyć wiadomości
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
