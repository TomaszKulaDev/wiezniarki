"use client";

import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderType: "prisoner" | "partner";
  recipientId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MessageModerationPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [messageToReject, setMessageToReject] = useState<string | null>(null);

  useEffect(() => {
    // Przekieruj, jeśli użytkownik nie jest adminem lub moderatorem
    if (!userLoading && user && !["admin", "moderator"].includes(user.role)) {
      router.push("/dashboard");
    }

    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user && ["admin", "moderator"].includes(user.role)) {
      fetchPendingMessages();
    }
  }, [user]);

  const fetchPendingMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/messages/moderation");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać wiadomości do moderacji");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Błąd pobierania wiadomości do moderacji:", error);
      setError(
        "Wystąpił błąd podczas ładowania wiadomości. Spróbuj odświeżyć stronę."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (messageId: string) => {
    try {
      setActionInProgress(messageId);

      const response = await fetch("/api/messages/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          status: "approved",
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zatwierdzić wiadomości");
      }

      // Usuń wiadomość z listy po zatwierdzeniu
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Błąd podczas zatwierdzania wiadomości:", error);
      alert("Wystąpił błąd podczas zatwierdzania wiadomości");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async () => {
    if (!messageToReject) return;

    try {
      setActionInProgress(messageToReject);

      const response = await fetch("/api/messages/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageToReject,
          status: "rejected",
          reason: rejectionReason || "Treść wiadomości narusza regulamin",
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się odrzucić wiadomości");
      }

      // Usuń wiadomość z listy po odrzuceniu
      setMessages((prev) => prev.filter((msg) => msg.id !== messageToReject));

      // Zresetuj stan
      setMessageToReject(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Błąd podczas odrzucania wiadomości:", error);
      alert("Wystąpił błąd podczas odrzucania wiadomości");
    } finally {
      setActionInProgress(null);
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
          onClick={fetchPendingMessages}
          className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Moderacja wiadomości</h1>
        <button
          onClick={fetchPendingMessages}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Odśwież
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">
            Brak wiadomości do moderacji
          </h2>
          <p className="text-gray-600">
            Wszystkie wiadomości zostały zweryfikowane. Sprawdź ponownie
            później.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Wiadomości oczekujące na moderację: {messages.length}
              </span>
              <span className="text-sm text-gray-500">
                Najstarsze wiadomości wyświetlane są jako pierwsze
              </span>
            </div>
          </div>

          <div className="divide-y">
            {messages.map((message) => (
              <div key={message.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="font-medium">
                      {message.senderType === "prisoner"
                        ? "Więźniarka"
                        : "Partner"}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      ID: {message.senderId.substring(0, 8)}...
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setMessageToReject(message.id);
                    }}
                    disabled={actionInProgress === message.id}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    Odrzuć
                  </button>
                  <button
                    onClick={() => handleApprove(message.id)}
                    disabled={actionInProgress === message.id}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {actionInProgress === message.id
                      ? "Zatwierdzanie..."
                      : "Zatwierdź"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal odrzucania wiadomości */}
      {messageToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Powód odrzucenia wiadomości
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Podaj powód odrzucenia wiadomości..."
              className="w-full border rounded p-2 h-32 mb-4"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMessageToReject(null)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Anuluj
              </button>
              <button
                onClick={handleReject}
                disabled={actionInProgress === messageToReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {actionInProgress === messageToReject
                  ? "Odrzucanie..."
                  : "Odrzuć wiadomość"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
