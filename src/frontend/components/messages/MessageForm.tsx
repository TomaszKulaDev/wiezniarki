import React, { useState, useRef, useEffect } from "react";

interface MessageFormProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function MessageForm({
  onSendMessage,
  isLoading,
}: MessageFormProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatyczne dostosowanie wysokości textarea
  const adjustTextareaHeight = (target: HTMLTextAreaElement) => {
    target.style.height = "40px";
    const newHeight = Math.min(target.scrollHeight, 128);
    target.style.height = `${newHeight}px`;
  };

  // Obsługa skrótu klawiszowego Enter do wysyłania (z obsługą Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Automatyczny focus na textarea przy montowaniu komponentu
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="p-2 md:p-3">
        <div className="relative flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight(e.target);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Napisz wiadomość..."
              className={`w-full resize-none rounded-2xl px-4 py-2.5 pr-16 min-h-[44px] border 
                bg-gray-50 hover:bg-white
                ${
                  isFocused
                    ? "border-gray-300 bg-white ring-1 ring-gray-200"
                    : "border-gray-200"
                }
                focus:outline-none focus:border-gray-300 focus:bg-white
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-all duration-200 ease-in-out
                placeholder:text-gray-400`}
              disabled={isLoading}
              maxLength={1000}
              rows={1}
              style={{
                overflowY: message.includes("\n") ? "auto" : "hidden",
              }}
            />
            <div
              className={`absolute right-4 bottom-2.5 text-xs 
              ${
                message.length >= 900
                  ? "text-orange-500"
                  : message.length >= 1000
                  ? "text-red-500"
                  : "text-gray-400"
              }
              transition-colors duration-200
              pointer-events-none select-none`}
            >
              {message.length}/1000
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className={`h-11 w-11 rounded-full 
              bg-[#1e50a0] text-white
              hover:bg-[#163b78] hover:scale-[1.02]
              disabled:opacity-50 disabled:bg-[#1e50a0] disabled:cursor-not-allowed disabled:hover:scale-100
              focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1
              transform transition-all duration-200 ease-in-out
              flex items-center justify-center flex-shrink-0
              shadow-sm hover:shadow-md`}
            title="Wyślij wiadomość"
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
                className="w-5 h-5 transform translate-x-[1px]"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            )}
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-400 text-center">
          Naciśnij Enter aby wysłać, Shift+Enter aby dodać nową linię
        </div>
      </form>
    </div>
  );
}
