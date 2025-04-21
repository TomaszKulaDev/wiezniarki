"use client";

import { useEffect, useState, useRef } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import MessageItem from "@/frontend/components/messages/MessageItem";
import MessageForm from "@/frontend/components/messages/MessageForm";

interface Message {
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

interface ConversationPartner {
  id: string;
  name: string;
  image?: string;
  role: string;
}

export default function ConversationPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<ConversationPartner | null>(null);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Przekieruj, jeśli użytkownik nie jest zalogowany
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user && id) {
      fetchMessages();
      fetchPartnerInfo();
    }
  }, [user, id]);

  useEffect(() => {
    // Przewiń do ostatniej wiadomości po załadowaniu lub dodaniu nowej
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/messages?matchId=${id}`);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać wiadomości");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Błąd pobierania wiadomości:", error);
      setError(
        "Wystąpił błąd podczas ładowania wiadomości. Spróbuj odświeżyć stronę."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPartnerInfo = async () => {
    try {
      const response = await fetch(`/api/matches/${id}/partner`);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać informacji o partnerze");
      }

      const data = await response.json();
      setPartner(data.partner);
    } catch (error) {
      console.error("Błąd pobierania informacji o partnerze:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user || !partner) return;

    try {
      setIsSending(true);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: id,
          recipientId: partner.id,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać wiadomości");
      }

      const data = await response.json();

      // Dodaj nową wiadomość do listy
      setMessages((prev) => [...prev, data.data]);

      // Odśwież listę wiadomości po krótkim opóźnieniu
      setTimeout(fetchMessages, 500);
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      alert("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    } finally {
      setIsSending(false);
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
          onClick={fetchMessages}
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
        <div className="flex items-center">
          <Link
            href="/dashboard/messages"
            className="mr-3 text-gray-500 hover:text-primary"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">
            {partner ? partner.name : "Konwersacja"}
          </h1>
        </div>
        {partner && (
          <Link
            href={`/profiles/${partner.id}`}
            className="text-primary hover:underline"
          >
            Zobacz profil
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-[calc(80vh-200px)] flex flex-col">
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
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
                <p className="text-gray-500 text-center">
                  Brak wiadomości. Rozpocznij konwersację!
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === user?.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <MessageForm
            onSendMessage={handleSendMessage}
            isLoading={isSending}
          />

          <div className="p-2 bg-gray-50 text-xs text-gray-500 text-center">
            Wszystkie wiadomości przechodzą weryfikację przez moderatorów przed
            dostarczeniem do odbiorcy.
          </div>
        </div>
      </div>
    </div>
  );
}
