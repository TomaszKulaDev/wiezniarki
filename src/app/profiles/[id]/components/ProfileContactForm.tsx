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
  currentUser: any; // Typ User byłby lepszy, ale użyjemy any dla uproszczenia
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

  // Użyj mutacji do utworzenia nowego dopasowania (match)
  const [createMatch] = useCreateMatchMutation();
  // Dodajemy mutację do wysyłania wiadomości
  const [sendMessage] = useSendMessageMutation();
  // Dodajemy mutację do aktualizacji statusu dopasowania
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
      // Utwórz nowe dopasowanie z profilem
      const matchResult = await createMatch({
        partnerId: profile.id,
      }).unwrap();

      // Automatycznie akceptuj dopasowanie
      if (matchResult.status === "pending") {
        await updateMatchStatus({
          matchId: matchResult.id,
          status: "accepted",
        }).unwrap();
      }

      // Wyślij pierwszą wiadomość
      await sendMessage({
        matchId: matchResult.id,
        recipientId: profile.id,
        content: message.trim(),
      }).unwrap();

      // Po utworzeniu dopasowania i wysłaniu wiadomości, przekieruj do widoku konwersacji
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nawiąż kontakt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <p className="mb-4 text-gray-600">
          Napisz wiadomość do {profile.firstName}. Wiadomość zostanie
          dostarczona natychmiast.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Napisz swoją wiadomość..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={5}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
