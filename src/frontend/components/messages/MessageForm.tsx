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
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          disabled={isLoading}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
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
            "Wyślij"
          )}
        </button>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-xs text-gray-500">Max 1000 znaków</p>
        <p className="text-xs text-gray-500">{message.length}/1000</p>
      </div>
    </form>
  );
}
