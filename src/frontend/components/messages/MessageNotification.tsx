import React, { useState, useEffect } from "react";
import Link from "next/link";

interface MessageNotificationProps {
  userId: string;
}

export default function MessageNotification({
  userId,
}: MessageNotificationProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Pobierz liczbę nieprzeczytanych wiadomości
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error(
          "Błąd pobierania liczby nieprzeczytanych wiadomości:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCount();

    // Ustawienie interwału odświeżania co 60 sekund
    const interval = setInterval(fetchUnreadCount, 60000);

    // Czyszczenie interwału przy odmontowaniu komponentu
    return () => clearInterval(interval);
  }, [userId]);

  if (isLoading || unreadCount === 0) {
    return null;
  }

  return (
    <Link href="/dashboard/messages" className="relative inline-block">
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </Link>
  );
}
