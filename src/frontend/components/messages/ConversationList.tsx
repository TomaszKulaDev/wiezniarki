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
    <div className="h-[600px] overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <button
            key={conversation.matchId}
            onClick={() => onSelectConversation(conversation.matchId)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 flex items-start space-x-3 ${
              selectedMatchId === conversation.matchId ? "bg-blue-50" : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {conversation.partnerImg ? (
                <img
                  src={conversation.partnerImg}
                  alt={conversation.partnerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {conversation.partnerName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Informacje o konwersacji */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {conversation.partnerName}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.lastMessageDate).toLocaleDateString(
                    "pl-PL",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage}
              </p>

              {/* Badge z nieprzeczytanymi */}
              {conversation.unreadCount > 0 && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                    {conversation.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
