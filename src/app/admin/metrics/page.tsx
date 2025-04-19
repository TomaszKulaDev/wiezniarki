"use client";

import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import Link from "next/link";

// Definicja interfejsu dla dbStats
interface DbStats {
  storage: {
    totalStorage: string;
    usedStorage: string;
    actualUsedStorage?: string;
    percentUsed: number;
    percentOfFreePlanLimit?: number;
    indexSize: string;
    freeStorage: string;
  };
  documents: {
    collections: number;
    documentsCount: number;
    avgDocumentSize: string;
    documentsByCollection?: Record<string, number>;
  };
  operations: {
    reads: number;
    writes: number;
    queries: number;
    updates: number;
  };
  performance: {
    avgResponseTime: string;
    slowQueries: number;
  };
  planLimits?: {
    connections?: {
      currentConnections?: number;
      availableConnections?: number;
    };
  };
}

export default function DatabaseMetricsPage() {
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mongoDbUrl =
    "https://cloud.mongodb.com/v2/67ffd6739ab076136c2bd86f#/metrics/replicaSet/67ffea35de7e8c0c49aeb8f0/explorer/wiezniarki/users/find";

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
            percentUsed: 25,
            indexSize: "24 MB",
            freeStorage: "384 MB",
          },
          documents: {
            collections: 8,
            documentsCount: 1250,
            avgDocumentSize: "3.2 KB",
          },
          operations: {
            reads: 5842,
            writes: 1243,
            queries: 7356,
            updates: 984,
          },
          performance: {
            avgResponseTime: "12ms",
            slowQueries: 6,
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

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Metryki Bazy Danych</h1>
      <p className="text-gray-600 mt-1">
        Monitoring wykorzystania i wydajności bazy danych MongoDB Atlas
      </p>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
          {error} - wyświetlane są dane przykładowe
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Karta wykorzystania pamięci */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Wykorzystanie pamięci
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Limit planu darmowego:</span>
            <span className="font-medium">512 MB</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Wykorzystana przestrzeń:</span>
            <span className="font-medium">
              {dbStats.storage.actualUsedStorage || dbStats.storage.usedStorage}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Rozmiar indeksu:</span>
            <span className="font-medium">{dbStats.storage.indexSize}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pozostało:</span>
            <span className="font-medium">{dbStats.storage.freeStorage}</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  (dbStats.storage.percentOfFreePlanLimit ||
                    dbStats.storage.percentUsed) > 90
                    ? "bg-red-500"
                    : (dbStats.storage.percentOfFreePlanLimit ||
                        dbStats.storage.percentUsed) > 70
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${
                    dbStats.storage.percentOfFreePlanLimit ||
                    dbStats.storage.percentUsed
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0%</span>
              <span>
                {dbStats.storage.percentOfFreePlanLimit ||
                  dbStats.storage.percentUsed}
                % z limitu planu darmowego
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>

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
              <p className="text-gray-600 mb-1">Wolnych miejsc</p>
              <p className="text-2xl font-semibold">
                {(
                  parseFloat(dbStats.storage.totalStorage) -
                  parseFloat(dbStats.storage.usedStorage)
                ).toFixed(2)}{" "}
                MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Karta operacji */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Operacje (ostatnie 24h)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Odczyty</p>
            <p className="text-2xl font-semibold text-blue-700">
              {dbStats.operations.reads.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Zapisy</p>
            <p className="text-2xl font-semibold text-green-700">
              {dbStats.operations.writes.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Zapytania</p>
            <p className="text-2xl font-semibold text-purple-700">
              {dbStats.operations.queries.toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Aktualizacje</p>
            <p className="text-2xl font-semibold text-orange-700">
              {dbStats.operations.updates.toLocaleString()}
            </p>
          </div>
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

      {/* Wydajność */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Wydajność</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Średni czas odpowiedzi</p>
            <p className="text-2xl font-semibold">
              {dbStats.performance.avgResponseTime}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Wolne zapytania (ponad 100ms)</p>
            <p className="text-2xl font-semibold">
              {dbStats.performance.slowQueries}
            </p>
          </div>
        </div>
      </div>

      {/* Limity planu MongoDB Atlas - zmodyfikowana wersja dla planu darmowego */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Limity planu MongoDB Atlas
          </h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Plan darmowy M0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Przestrzeń dyskowa */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">
              Przestrzeń dyskowa
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Limit planu:</span>
                <span className="font-medium">512 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wykorzystano:</span>
                <span className="font-medium">
                  {dbStats.storage.actualUsedStorage ||
                    dbStats.storage.usedStorage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pozostało:</span>
                <span className="font-medium">
                  {dbStats.storage.freeStorage}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (dbStats.storage.percentOfFreePlanLimit ||
                      dbStats.storage.percentUsed) > 90
                      ? "bg-red-500"
                      : (dbStats.storage.percentOfFreePlanLimit ||
                          dbStats.storage.percentUsed) > 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${
                      dbStats.storage.percentOfFreePlanLimit ||
                      dbStats.storage.percentUsed
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span
                  className={`${
                    (dbStats.storage.percentOfFreePlanLimit ||
                      dbStats.storage.percentUsed) > 90
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {(dbStats.storage.percentOfFreePlanLimit ||
                    dbStats.storage.percentUsed) >= 90
                    ? "Krytycznie mało miejsca!"
                    : ""}
                </span>
                <span className="text-gray-500">
                  {dbStats.storage.percentOfFreePlanLimit ||
                    dbStats.storage.percentUsed}
                  % z limitu
                </span>
              </div>
            </div>
          </div>

          {/* Połączenia */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Połączenia</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Maksymalna liczba:</span>
                <span className="font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aktualnie aktywne:</span>
                <span className="font-medium">
                  {dbStats.planLimits?.connections?.currentConnections || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dostępne:</span>
                <span className="font-medium">
                  {dbStats.planLimits?.connections?.availableConnections ||
                    "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800">
              <p>
                <strong>Uwaga:</strong> W planie darmowym połączenia są
                współdzielone z innymi użytkownikami, co może wpływać na
                wydajność.
              </p>
            </div>
          </div>

          {/* Wydajność */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">
              Zasoby obliczeniowe
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">CPU:</span>
                <span className="font-medium">Współdzielone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RAM:</span>
                <span className="font-medium">Współdzielone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wydajność I/O:</span>
                <span className="font-medium">Ograniczona</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
              <p>
                Plan darmowy ma ograniczoną wydajność. Przy dużym obciążeniu
                może wystąpić spowolnienie.
              </p>
            </div>
          </div>
        </div>

        {/* Ograniczenia planu darmowego */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">
            Ograniczenia planu darmowego
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Maksymalnie 512 MB przestrzeni dyskowej</li>
              <li>Ograniczona liczba jednoczesnych połączeń</li>
              <li>Współdzielone zasoby CPU i RAM</li>
              <li>Ograniczona przepustowość sieciowa</li>
            </ul>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Możliwy throttling przy wysokim obciążeniu</li>
              <li>Brak dedykowanego wsparcia</li>
              <li>Możliwe opóźnienia w dostępie do danych</li>
              <li>Brak automatycznego skalowania</li>
            </ul>
          </div>
        </div>

        {/* Rekomendacje dla planu darmowego */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">
            Rekomendacje dla planu darmowego
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
            <li>
              Regularnie monitoruj wykorzystanie przestrzeni dyskowej - przy
              zbliżaniu się do limitu 512 MB, rozważ usunięcie niepotrzebnych
              danych
            </li>
            <li>
              Zoptymalizuj zapytania, aby zmniejszyć obciążenie bazy danych
            </li>
            <li>
              Dla lepszej wydajności, rozważ przejście na plan płatny, jeśli
              aplikacja zyska popularność
            </li>
            <li>
              Używaj indeksów, ale oszczędnie - zajmują one cenną przestrzeń
              dyskową
            </li>
            <li>
              Unikaj dużych operacji agregacji, które mogą obciążać
              współdzielone zasoby
            </li>
          </ul>
        </div>

        {/* Dostępne ulepszenia */}
        <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <h3 className="font-medium text-blue-800 mb-1">
              Potrzebujesz więcej zasobów?
            </h3>
            <p className="text-sm text-blue-700">
              Plany płatne MongoDB Atlas oferują więcej przestrzeni, dedykowane
              zasoby i lepszą wydajność.
            </p>
          </div>
          <a
            href="https://www.mongodb.com/cloud/atlas/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Zobacz plany
          </a>
        </div>
      </div>

      {/* MongoDB Atlas Dashboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Panel MongoDB Atlas
          </h2>
          <a
            href={mongoDbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Otwórz w nowym oknie
          </a>
        </div>
        <div className="border rounded-lg overflow-hidden bg-gray-50 h-96 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-lg font-medium mb-4">
              Panel MongoDB Atlas zawiera szczegółowe statystyki i narzędzia do
              monitorowania
            </p>
            <a
              href={mongoDbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Przejdź do MongoDB Atlas
            </a>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>W panelu MongoDB Atlas możesz:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Monitorować wykorzystanie zasobów w czasie rzeczywistym</li>
            <li>Analizować wydajność zapytań i znajdować wąskie gardła</li>
            <li>Sprawdzać dane historyczne i identyfikować trendy</li>
            <li>Konfigurować alerty dla różnych metryk</li>
            <li>Zarządzać indeksami i optymalizować zapytania</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
