import { useState, useEffect } from "react";
import { User } from "@/backend/models/User";

interface DashboardStatsProps {
  userId: string;
  role: User["role"];
}

export default function DashboardStats({ userId, role }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    matches: 0,
    messages: 0,
    views: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // W przyszłości zastąpić rzeczywistym wywołaniem API
        // Symulacja danych
        setTimeout(() => {
          setStats({
            matches: Math.floor(Math.random() * 10),
            messages: Math.floor(Math.random() * 20),
            views: Math.floor(Math.random() * 50),
            notifications: Math.floor(Math.random() * 5),
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Błąd podczas ładowania statystyk:", error);
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  const getStatIcon = (type: string) => {
    switch (type) {
      case "matches":
        return (
          <div className="p-3 rounded-full bg-pink-100 text-pink-600">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        );
      case "messages":
        return (
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        );
      case "views":
        return (
          <div className="p-3 rounded-full bg-green-100 text-green-600">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        );
      case "notifications":
        return (
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Statystyki</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              {getStatIcon("matches")}
              <h3 className="ml-3 text-lg font-semibold">Dopasowania</h3>
            </div>
            <p className="text-2xl font-bold">{stats.matches}</p>
            <p className="text-xs text-gray-500 mt-1">
              {role === "prisoner"
                ? "Zainteresowanych osób"
                : "Zainteresowanych więźniarek"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              {getStatIcon("messages")}
              <h3 className="ml-3 text-lg font-semibold">Wiadomości</h3>
            </div>
            <p className="text-2xl font-bold">{stats.messages}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.messages > 0
                ? "Nowe wiadomości"
                : "Brak nowych wiadomości"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              {getStatIcon("views")}
              <h3 className="ml-3 text-lg font-semibold">Wyświetlenia</h3>
            </div>
            <p className="text-2xl font-bold">{stats.views}</p>
            <p className="text-xs text-gray-500 mt-1">
              {`Wyświetleń ${
                role === "prisoner" ? "Twojego profilu" : "profili więźniarek"
              }`}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              {getStatIcon("notifications")}
              <h3 className="ml-3 text-lg font-semibold">Powiadomienia</h3>
            </div>
            <p className="text-2xl font-bold">{stats.notifications}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.notifications > 0
                ? "Nieprzeczytane powiadomienia"
                : "Brak powiadomień"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
