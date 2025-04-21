"use client";

import { useState } from "react";
import { Profile } from "@/backend/models/Profile";
import {
  useCreateMatchMutation,
  useUpdateMatchStatusMutation,
} from "@/frontend/store/apis/matchApi";
import { useSendMessageMutation } from "@/frontend/store/apis/messageApi";
import { useRouter } from "next/navigation";

interface ProfileContactFormProps {
  profile: Profile;
  currentUser: any;
  onClose: () => void;
}

export default function ProfileContactForm({
  profile,
  currentUser,
  onClose,
}: ProfileContactFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [createMatch] = useCreateMatchMutation();
  const [sendMessage] = useSendMessageMutation();
  const [updateMatchStatus] = useUpdateMatchStatusMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Wiadomość nie może być pusta");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const matchResult = await createMatch({
        partnerId: profile.id,
      }).unwrap();

      if (matchResult.status === "pending") {
        await updateMatchStatus({
          matchId: matchResult.id,
          status: "accepted",
        }).unwrap();
      }

      await sendMessage({
        matchId: matchResult.id,
        recipientId: profile.id,
        content: message.trim(),
      }).unwrap();

      router.push(`/dashboard/messages/${matchResult.id}`);
      onClose();
    } catch (err: any) {
      console.error("Błąd podczas nawiązywania kontaktu:", err);
      setError(
        err.data?.message ||
          "Nie udało się nawiązać kontaktu. Spróbuj ponownie później."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Nawiąż kontakt z {profile.firstName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Zamknij"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Napisz pierwszą wiadomość do {profile.firstName}. Pamiętaj o
          zachowaniu szacunku i kultury wypowiedzi.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Twoja wiadomość
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Napisz swoją wiadomość..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              rows={5}
              required
              disabled={isSubmitting}
            />
            <p className="mt-2 text-sm text-gray-500">
              Maksymalnie 1000 znaków ({message.length}/1000)
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
              style={{
                backgroundColor: "#1e50a0",
                borderColor: "#1e50a0",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                  Wysyłanie...
                </span>
              ) : (
                "Wyślij wiadomość"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
