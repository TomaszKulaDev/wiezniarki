import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import clientPromise from "@/backend/utils/mongodb";

export async function GET(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    // Połączenie z bazą
    const client = await clientPromise;
    const db = client.db(dbName);
    const admin = db.admin();

    // Pobierz nazwę wszystkich kolekcji
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    // Pobierz liczbę dokumentów w każdej kolekcji
    const documentCounts: Record<string, number> = {};
    let totalDocuments = 0;

    for (const colName of collectionNames) {
      const count = await db.collection(colName).countDocuments();
      documentCounts[colName] = count;
      totalDocuments += count;
    }

    // Oblicz statystyki bazy danych
    const dbStats = await db.stats();

    // Uśredniony rozmiar dokumentu
    const avgDocSize =
      totalDocuments > 0 ? (dbStats.dataSize / totalDocuments).toFixed(2) : 0;

    // Pobierz informacje o ostatnich operacjach
    // Uwaga: to wymaga uprawnień administratora w MongoDB
    let operations = {
      reads: 0,
      writes: 0,
      queries: 0,
      updates: 0,
    };

    try {
      // Możemy użyć serverStatus, jeśli mamy uprawnienia administratora
      const serverStatus = await admin.serverStatus();

      if (serverStatus && serverStatus.opcounters) {
        operations = {
          reads: serverStatus.opcounters.query || 0,
          writes: serverStatus.opcounters.insert || 0,
          queries: serverStatus.opcounters.query || 0,
          updates: serverStatus.opcounters.update || 0,
        };
      }
    } catch (error) {
      console.log("Brak uprawnień do pobrania statystyk serwera:", error);
      // Używamy domyślnych wartości
    }

    // Pobierz informacje o statystykach serwera
    let serverStats = null;
    try {
      serverStats = await admin.serverStatus();
    } catch (error) {
      console.log("Brak uprawnień do pobrania statystyk serwera:", error);
    }

    // Stałe dla planu darmowego
    const FREE_PLAN_STORAGE_LIMIT_MB = 512;
    const FREE_PLAN_STORAGE_LIMIT_BYTES =
      FREE_PLAN_STORAGE_LIMIT_MB * 1024 * 1024;

    // Oblicz aktualne wykorzystanie jako procent całkowitego limitu planu darmowego
    const actualStorageBytes = dbStats.dataSize + dbStats.indexSize;
    const actualStorageMB = actualStorageBytes / (1024 * 1024);
    const percentOfFreePlanLimit = Math.min(
      Math.round((actualStorageBytes / FREE_PLAN_STORAGE_LIMIT_BYTES) * 100),
      100 // Nie więcej niż 100%
    );

    // Zwróć statystyki
    return NextResponse.json({
      storage: {
        totalStorageBytes: dbStats.storageSize,
        usedStorageBytes: dbStats.dataSize,
        indexSizeBytes: dbStats.indexSize,
        totalStorageMB: (dbStats.storageSize / (1024 * 1024)).toFixed(2),
        usedStorageMB: (dbStats.dataSize / (1024 * 1024)).toFixed(2),
        indexSizeMB: (dbStats.indexSize / (1024 * 1024)).toFixed(2),

        percentUsed:
          Math.round((dbStats.dataSize / dbStats.storageSize) * 100) || 0,

        freePlanLimitMB: FREE_PLAN_STORAGE_LIMIT_MB,
        actualUsedStorageMB: actualStorageMB.toFixed(2),
        freeStorageMB: (FREE_PLAN_STORAGE_LIMIT_MB - actualStorageMB).toFixed(
          2
        ),
        percentOfFreePlanLimit: percentOfFreePlanLimit,

        totalStorage: `${(dbStats.storageSize / (1024 * 1024)).toFixed(2)} MB`,
        usedStorage: `${(dbStats.dataSize / (1024 * 1024)).toFixed(2)} MB`,
        indexSize: `${(dbStats.indexSize / (1024 * 1024)).toFixed(2)} MB`,
        actualUsedStorage: `${actualStorageMB.toFixed(2)} MB`,
        freeStorage: `${(FREE_PLAN_STORAGE_LIMIT_MB - actualStorageMB).toFixed(
          2
        )} MB`,
      },
      documents: {
        collections: collections.length,
        documentsCount: totalDocuments,
        documentsByCollection: documentCounts,
        avgDocumentSize: `${avgDocSize} B`,
      },
      operations: operations,
      performance: {
        avgResponseTime: "12ms",
        slowQueries: 0,
      },
      planLimits: {
        planName: "MongoDB Atlas Free (M0)",
        planDescription: "Plan darmowy z ograniczonymi zasobami",
        connections: {
          maxConnections: 100,
          currentConnections: serverStats?.connections?.current || 0,
          availableConnections: 100 - (serverStats?.connections?.current || 0),
        },
        queries: {
          dailyLimit: "Ograniczone",
          usedQueries: operations.reads + operations.queries,
          remainingQueries: "Nieznane",
          resetTime: "00:00 UTC",
          note: "Plan darmowy ma ograniczoną liczbę zapytań i może być throttlowany",
        },
        networkTransfer: {
          monthlyLimit: "10 GB",
          usedTransfer: "Nieznane",
          remainingTransfer: "Nieznane",
          note: "Dane transferu są przybliżone",
        },
        compute: {
          ram: "Współdzielone",
          cpu: "Współdzielone",
          note: "Plan darmowy wykorzystuje współdzielone zasoby obliczeniowe",
        },
        freePlanLimitations: [
          "Brak dedykowanej pamięci RAM",
          "Współdzielone zasoby CPU",
          "Ograniczona przepustowość",
          "Brak automatycznego skalowania",
          "Ograniczone wsparcie",
          "Możliwy throttling przy wysokim obciążeniu",
          "Plany płatne oferują wyższą wydajność i więcej funkcji",
        ],
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania statystyk bazy danych:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd";

    return NextResponse.json(
      {
        message: "Wystąpił błąd podczas pobierania statystyk bazy danych",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
