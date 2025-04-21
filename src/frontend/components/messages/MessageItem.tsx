import React from "react";
import Image from "next/image";

interface MessageProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    readStatus: boolean;
    moderationStatus: "pending" | "approved" | "rejected";
  };
  isOwn: boolean;
}

export default function MessageItem({ message, isOwn }: MessageProps) {
  // Formatuj datę
  const formattedDate = formatDateTime(new Date(message.createdAt));

  // Ustaw dodatkowe style dla własnych wiadomości
  const containerClasses = isOwn ? "flex justify-end" : "flex justify-start";

  const bubbleClasses = isOwn
    ? "bg-primary text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%] break-words"
    : "bg-gray-100 text-gray-800 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%] break-words";

  // Dla wiadomości oczekujących na moderację dodajemy wskaźnik statusu
  const isPending = isOwn && message.moderationStatus === "pending";

  // Dodajemy console.log dla debugowania - ważne, dodajemy więcej informacji
  console.log("Renderowanie wiadomości:", {
    id: message.id,
    content: message.content.substring(0, 20) + "...",
    isOwn,
    senderId: message.senderId,
    readStatus: message.readStatus,
    moderationStatus: message.moderationStatus,
    createdAt: new Date(message.createdAt),
  });

  return (
    <div className={containerClasses}>
      <div>
        <div className={bubbleClasses}>
          <p>{message.content}</p>
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className="text-xs opacity-70">{formattedDate}</span>

            {isOwn && (
              <>
                {isPending ? (
                  <span className="text-xs opacity-70 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Weryfikacja
                  </span>
                ) : message.readStatus ? (
                  <span className="text-xs opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="text-xs opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Funkcja pomocnicza do formatowania daty
function formatDateTime(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);

  // Format godziny
  const timeFormat = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Jeśli wiadomość jest z dzisiaj, pokaż tylko godzinę
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return timeFormat;
  }

  // Jeśli wiadomość jest z wczoraj
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `wczoraj, ${timeFormat}`;
  }

  // Jeśli wiadomość jest z tego roku, pokaż dzień i miesiąc
  if (messageDate.getFullYear() === now.getFullYear()) {
    return (
      messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "short",
      }) + `, ${timeFormat}`
    );
  }

  // W przeciwnym razie pokaż pełną datę
  return (
    messageDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + `, ${timeFormat}`
  );
}
