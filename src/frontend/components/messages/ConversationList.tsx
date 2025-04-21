import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Conversation } from "@/frontend/store/apis/messageApi";

interface ConversationListProps {
  conversations: Conversation[];
  selectedMatchId: string | null;
  onSelectConversation: (matchId: string) => void;
}

export default function ConversationList({
  conversations,
  selectedMatchId,
  onSelectConversation,
}: ConversationListProps) {
  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: Date): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Dzisiaj - pokaż godzinę
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      // Wczoraj
      return "wczoraj";
    } else if (diffDays < 7) {
      // W tym tygodniu - pokaż dzień tygodnia
      return dateObj.toLocaleDateString([], { weekday: "short" });
    } else {
      // Dawniej - pokaż datę
      return dateObj.toLocaleDateString([], {
        day: "numeric",
        month: "short",
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Brak konwersacji</p>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-800">Konwersacje</h2>
      </div>
      <ul className="divide-y">
        {conversations.map((conversation) => (
          <li
            key={conversation.matchId}
            className={`hover:bg-gray-50 transition-colors ${
              selectedMatchId === conversation.matchId ? "bg-blue-50" : ""
            }`}
          >
            <button
              onClick={() => onSelectConversation(conversation.matchId)}
              className="w-full p-4 text-left flex items-center"
            >
              {/* Avatar */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {conversation.partnerImg ? (
                  <Image
                    src={conversation.partnerImg}
                    alt={conversation.partnerName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                    {conversation.partnerName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Informacje */}
              <div className="ml-4 flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {conversation.partnerName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(conversation.lastMessageDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 truncate flex-grow">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
