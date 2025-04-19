"use client";

import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

// Definicja interfejsu dla dbStats
interface DbStats {
  storage?: {
    totalStorage: string;
    usedStorage: string;
    freeStorage?: string;
  };
  documents: {
    collections: number;
    documentsCount: number;
    avgDocumentSize: string;
    documentsByCollection?: Record<string, number>;
  };
}

export default function DatabaseMetricsPage() {
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobierz statystyki przy montowaniu komponentu
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/db-stats");

        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const data = await response.json();
        setDbStats(data);
        setError(null);
      } catch (err) {
        console.error("Błąd podczas pobierania statystyk:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas pobierania statystyk"
        );

        // Domyślne dane w przypadku błędu
        setDbStats({
          storage: {
            totalStorage: "512 MB",
            usedStorage: "128 MB",
            freeStorage: "384 MB",
          },
          documents: {
            collections: 8,
            documentsCount: 1250,
            avgDocumentSize: "3.2 KB",
            documentsByCollection: {
              users: 250,
              profiles: 180,
              messages: 520,
              tokens: 300,
            },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchStats();
    }
  }, [user]);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // AdminLayout już obsługuje brak uprawnień
  }

  if (!dbStats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Brak danych</h1>
        <p className="text-gray-600 mb-6">
          Nie udało się pobrać statystyk bazy danych.
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  // Stała wartość limitu planu darmowego
  const freeplanLimit = "512 MB";

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Metryki Bazy Danych</h1>
      <p className="text-gray-600 mt-1">
        Monitoring kolekcji i dokumentów bazy danych
      </p>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
          {error} - wyświetlane są dane przykładowe
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
        {/* Karta statystyk dokumentów */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Statystyki dokumentów
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Liczba kolekcji</p>
              <p className="text-2xl font-semibold">
                {dbStats.documents.collections}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Liczba dokumentów</p>
              <p className="text-2xl font-semibold">
                {dbStats.documents.documentsCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Średni rozmiar dokumentu</p>
              <p className="text-2xl font-semibold">
                {dbStats.documents.avgDocumentSize}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Całkowity rozmiar danych</p>
              <p className="text-2xl font-semibold">
                {dbStats.storage?.usedStorage || "N/A"}
              </p>
            </div>
          </div>

          {/* Informacja o limicie planu darmowego */}
          {dbStats.storage && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-700">
                  Limit planu darmowego:
                </p>
                <p className="font-medium">{freeplanLimit}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Wykorzystano:</p>
                <p className="font-medium">{dbStats.storage.usedStorage}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Pozostało:</p>
                <p className="font-medium">
                  {dbStats.storage.freeStorage || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liczba dokumentów w kolekcjach */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Dokumenty w kolekcjach
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(dbStats.documents.documentsByCollection || {}).map(
            ([collection, count]) => (
              <div key={collection} className="p-3 border rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">{collection}</p>
                <p className="text-xl font-semibold">
                  {Number(count).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
