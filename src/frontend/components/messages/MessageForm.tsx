import React, { useState } from "react";

interface MessageFormProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function MessageForm({
  onSendMessage,
  isLoading,
}: MessageFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="p-2">
        <div className="relative flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Napisz wiadomość..."
              className="w-full resize-none rounded-full px-4 py-2 pr-12 min-h-[40px] border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-100"
              disabled={isLoading}
              maxLength={1000}
              rows={1}
              style={{
                height: "40px",
                overflowY: message.includes("\n") ? "auto" : "hidden",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "40px";
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <span className="absolute right-4 bottom-3 text-xs text-gray-400">
              {message.length}/1000
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="h-10 w-10 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
