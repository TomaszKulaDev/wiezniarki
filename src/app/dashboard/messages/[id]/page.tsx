"use client";

import { useEffect, useRef, useState } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import MessageItem from "@/frontend/components/messages/MessageItem";
import MessageForm from "@/frontend/components/messages/MessageForm";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from "@/frontend/store/apis/messageApi";
import { useGetMatchPartnerQuery } from "@/frontend/store/apis/matchApi";

export default function ConversationPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  // Pobieranie wiadomości z RTK Query
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { matchId: id },
    // Nie wykonuj zapytania, jeśli nie ma ID lub użytkownika
    {
      skip: !id || !user,
      // Automatyczne odświeżanie co 3 sekundy
      pollingInterval: 3000,
    }
  );

  // Pobieranie informacji o partnerze z RTK Query
  const {
    data: partnerData,
    isLoading: isPartnerLoading,
    error: partnerError,
    refetch: refetchPartner,
  } = useGetMatchPartnerQuery(id, {
    skip: !id || !user,
    // Dodajemy dłuższe cachowanie gdy zapytanie się powiedzie
    keepUnusedDataFor: 300, // 5 minut
  });

  // Mutacje do wysyłania i oznaczania wiadomości
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatycznie przekieruj na listę konwersacji, jeśli nie można pobrać danych partnera po 3 próbach
  const [partnerErrorCount, setPartnerErrorCount] = useState(0);

  // Tryb debug - pokaż dodatkowe informacje
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (partnerError) {
      setPartnerErrorCount((prev) => prev + 1);
    } else {
      setPartnerErrorCount(0);
    }

    if (partnerErrorCount >= 3) {
      console.error(
        "Nie udało się pobrać danych partnera po 3 próbach, przekierowuję..."
      );
      router.push("/dashboard/messages");
    }
  }, [partnerError, partnerErrorCount, router]);

  useEffect(() => {
    // Przekieruj, jeśli użytkownik nie jest zalogowany
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    // Przewiń do ostatniej wiadomości po załadowaniu lub dodaniu nowej
    if (messagesEndRef.current && messagesData?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData?.messages]);

  useEffect(() => {
    // Oznaczanie nieprzeczytanych wiadomości jako przeczytane
    if (messagesData?.messages && user) {
      console.log("Dostępne wiadomości:", messagesData.messages.length);
      console.log("ID bieżącego użytkownika:", user.id);

      messagesData.messages.forEach((message) => {
        console.log(
          `Wiadomość ${message.id} - od ${message.senderId} do ${message.recipientId}, status: ${message.readStatus}`
        );

        if (
          message.recipientId === user.id &&
          !message.readStatus &&
          message.moderationStatus === "approved"
        ) {
          console.log("Oznaczam wiadomość jako przeczytaną:", message.id);
          markAsRead(message.id)
            .unwrap()
            .then(() => console.log("Oznaczenie wiadomości powiodło się"))
            .catch((err) => console.error("Błąd oznaczania wiadomości:", err));
        }
      });
    }
  }, [messagesData?.messages, user, markAsRead]);

  useEffect(() => {
    // Automatyczne odświeżanie wiadomości co 5 sekund
    const interval = setInterval(() => {
      if (id && user) {
        console.log("Automatyczne odświeżanie wiadomości...");
        refetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, user, refetchMessages]);

  useEffect(() => {
    // Jeśli wystąpił błąd przy pobieraniu partnera, ponów próbę
    if (partnerError) {
      console.error(
        "Błąd podczas pobierania informacji o partnerze:",
        partnerError
      );
      // Ponów próbę po 2 sekundach
      const timeout = setTimeout(() => {
        console.log("Ponawiam próbę pobrania informacji o partnerze...");
        refetchPartner();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [partnerError, refetchPartner]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // Jeśli nie mamy danych partnera, ponów próbę ich pobrania
    if (!partnerData?.partner) {
      console.log("Brak danych partnera, ponawiam próbę...");
      await refetchPartner();

      // Jeśli nadal nie mamy danych partnera, pokaż błąd
      if (!partnerData?.partner) {
        console.error("Nie można wysłać wiadomości: brak danych partnera");
        alert("Nie można wysłać wiadomości. Spróbuj odświeżyć stronę.");
        return;
      }
    }

    try {
      // Użyj mutacji z RTK Query zamiast fetch
      await sendMessage({
        matchId: id,
        recipientId: partnerData.partner.id,
        content: content.trim(),
      }).unwrap();

      // Odśwież wiadomości po wysłaniu
      refetchMessages();
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      alert("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    }
  };

  const isLoading = userLoading || isMessagesLoading || isPartnerLoading;
  const partner = partnerData?.partner;
  const messages = messagesData?.messages || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">
          Wystąpił błąd podczas ładowania wiadomości. Spróbuj odświeżyć stronę.
        </p>
        <button
          onClick={() => refetchMessages()}
          className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // Obsługa błędu pobierania danych partnera
  if (partnerError && !partner) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">
          Wystąpił błąd podczas ładowania danych partnera.
        </p>
        <div className="mt-2 flex flex-col md:flex-row gap-2">
          <button
            onClick={() => refetchPartner()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Spróbuj ponownie
          </button>
          <button
            onClick={() => router.push("/dashboard/messages")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Wróć do wiadomości
          </button>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {debugMode ? "Ukryj szczegóły" : "Pokaż szczegóły"}
          </button>
        </div>

        {debugMode && (
          <div className="mt-4 bg-gray-800 text-white p-4 rounded overflow-auto max-h-60">
            <p>Match ID: {id}</p>
            <p>User ID: {user?.id}</p>
            <p>Error: {JSON.stringify(partnerError)}</p>
            <p>Messages count: {messages.length}</p>
          </div>
        )}
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
            {partnerError && " (Nie można załadować danych)"}
          </h1>
        </div>
        {partner && !partnerError && (
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
        </div>
      </div>
    </div>
  );
}
