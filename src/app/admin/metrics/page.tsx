"use client";

import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import Link from "next/link";

export default function DatabaseMetricsPage() {
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const mongoDbUrl = "https://cloud.mongodb.com/v2/67ffd6739ab076136c2bd86f#/metrics/replicaSet/67ffea35de7e8c0c49aeb8f0/explorer/wiezniarki/users/find";

  // Dane statystyczne jako placeholder
  const dbStats = {
    totalStorage: "512 MB",
    usedStorage: "128 MB",
    percentUsed: 25,
    collections: 8,
    documentsCount: 1250,
    avgDocumentSize: "3.2 KB",
    operations: {
      reads: 5842,
      writes: 1243,
      queries: 7356,
      updates: 984
    },
    performance: {
      avgResponseTime: "12ms",
      slowQueries: 6
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Brak dostępu</h1>
        <p className="text-gray-600 mb-6">Nie masz uprawnień do wyświetlenia tej strony.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Metryki Bazy Danych</h1>
        <p className="text-gray-600 mt-1">
          Monitoring wykorzystania i wydajności bazy danych MongoDB Atlas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Karta wykorzystania pamięci */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Wykorzystanie pamięci</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Całkowita przestrzeń:</span>
            <span className="font-medium">{dbStats.totalStorage}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Wykorzystana przestrzeń:</span>
            <span className="font-medium">{dbStats.usedStorage}</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${dbStats.percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0%</span>
              <span>{dbStats.percentUsed}% wykorzystane</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Karta statystyk dokumentów */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statystyki dokumentów</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Liczba kolekcji</p>
              <p className="text-2xl font-semibold">{dbStats.collections}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Liczba dokumentów</p>
              <p className="text-2xl font-semibold">{dbStats.documentsCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Średni rozmiar dokumentu</p>
              <p className="text-2xl font-semibold">{dbStats.avgDocumentSize}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Wolnych miejsc</p>
              <p className="text-2xl font-semibold">
                {((512 - dbStats.percentUsed * 5.12) / 1).toFixed(0)} MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Karta operacji */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Operacje (ostatnie 24h)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Odczyty</p>
            <p className="text-2xl font-semibold text-blue-700">{dbStats.operations.reads.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Zapisy</p>
            <p className="text-2xl font-semibold text-green-700">{dbStats.operations.writes.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Zapytania</p>
            <p className="text-2xl font-semibold text-purple-700">{dbStats.operations.queries.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Aktualizacje</p>
            <p className="text-2xl font-semibold text-orange-700">{dbStats.operations.updates.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Wydajność */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Wydajność</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Średni czas odpowiedzi</p>
            <p className="text-2xl font-semibold">{dbStats.performance.avgResponseTime}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Wolne zapytania (>100ms)</p>
            <p className="text-2xl font-semibold">{dbStats.performance.slowQueries}</p>
          </div>
        </div>
      </div>

      {/* MongoDB Atlas Dashboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Panel MongoDB Atlas</h2>
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
            <p className="text-lg font-medium mb-4">Panel MongoDB Atlas zawiera szczegółowe statystyki i narzędzia do monitorowania</p>
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