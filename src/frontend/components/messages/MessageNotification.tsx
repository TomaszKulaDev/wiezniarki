import React, { useEffect } from "react";
import Link from "next/link";
import { useGetUnreadCountQuery } from "@/frontend/store/apis/messageApi";

interface MessageNotificationProps {
  userId?: string;
}

export default function MessageNotification({
  userId,
}: MessageNotificationProps) {
  // Pobierz liczbę nieprzeczytanych wiadomości używając RTK Query
  const { data, isLoading, refetch } = useGetUnreadCountQuery(undefined, {
    // Pomijaj, jeśli nie ma ID użytkownika
    skip: !userId,
    // Odświeżaj co 30 sekund
    pollingInterval: 30000,
  });

  const unreadCount = data?.count || 0;

  // Efekt do ustawienia tytułu strony z licznikiem nieprzeczytanych wiadomości
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Nowe wiadomości - Więźniarki`;
    } else {
      document.title = "Więźniarki";
    }

    return () => {
      document.title = "Więźniarki";
    };
  }, [unreadCount]);

  if (isLoading || !userId || unreadCount === 0) {
    return null;
  }

  return (
    <Link href="/dashboard/messages" className="relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-600 hover:text-primary transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
