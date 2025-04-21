import React from "react";
import Image from "next/image";

// Zaktualizowany interfejs MessageProps
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  readStatus: boolean;
  moderationStatus: "pending" | "approved" | "rejected";
}

interface MessageProps {
  message: Message;
  isOwn: boolean;
  isLastInGroup: boolean; // Dodana nowa właściwość
  showTimestamp: boolean; // Dodana nowa właściwość
}

export default function MessageItem({
  message,
  isOwn,
  isLastInGroup,
  showTimestamp,
}: MessageProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "pl-PL",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      className={`
      flex 
      ${isOwn ? "justify-end" : "justify-start"}
      ${isLastInGroup ? "mb-[4px]" : "mb-[2px]"}
      relative
      group
    `}
    >
      <div className="max-w-[65%]">
        {/* Wiadomość */}
        <div
          className={`
          px-[12px]
          py-[6px]
          text-[14px]
          leading-[20px]
          ${
            isOwn
              ? "bg-[#0095F6] text-white rounded-[18px] rounded-br-[4px]"
              : "bg-[#E9E9E9] text-black rounded-[18px] rounded-bl-[4px]"
          }
        `}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Timestamp - widoczny tylko dla ostatniej wiadomości w grupie lub przy hover */}
        {(showTimestamp || isLastInGroup) && (
          <div
            className={`
            text-[11px]
            text-[#8E8E8E]
            mt-[3px]
            leading-[13px]
            select-none
            ${isOwn ? "text-right mr-[8px]" : "ml-[8px]"}
            ${
              !isLastInGroup &&
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            }
          `}
          >
            {formattedTime}
            {isOwn && (
              <span className="ml-1 inline-flex items-center">
                {message.moderationStatus === "pending" ? (
                  <svg
                    className="w-[14px] h-[14px] text-[#8E8E8E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                ) : (
                  <svg
                    className="w-[14px] h-[14px] text-[#8E8E8E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeWidth="2" d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
