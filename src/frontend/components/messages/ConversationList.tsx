import React from "react";
import Image from "next/image";

interface Conversation {
  matchId: string;
  partnerId: string;
  partnerName: string;
  partnerImg?: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}

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
  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Konwersacje</h3>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {conversations.map((conversation) => (
          <div
            key={conversation.matchId}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
              selectedMatchId === conversation.matchId ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelectConversation(conversation.matchId)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {conversation.partnerImg ? (
                  <Image
                    src={conversation.partnerImg}
                    alt={conversation.partnerName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {conversation.partnerName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium truncate">
                    {conversation.partnerName}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {formatDate(conversation.lastMessageDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Funkcja pomocnicza do formatowania daty
function formatDate(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);

  // Jeśli wiadomość jest z dzisiaj, pokaż tylko godzinę
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Jeśli wiadomość jest z tego tygodnia, pokaż dzień tygodnia
  const diffDays = Math.round(
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: "short" });
  }

  // W przeciwnym razie pokaż datę
  return messageDate.toLocaleDateString();
}
