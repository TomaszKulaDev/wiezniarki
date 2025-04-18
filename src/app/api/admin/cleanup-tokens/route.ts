import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/backend/services/jwtService";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";

const COLLECTION_NAME = "tokens";

export async function POST(request: NextRequest) {
  try {
    // Middleware do weryfikacji, czy użytkownik jest administratorem
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    // Pobierz parametry czyszczenia z ciała żądania
    const body = await request.json();
    const {
      removeExpired = true,
      removeRevoked = true,
      olderThan = 30,
      dryRun = false,
      forceCleanup = false, // Opcja dla wymuszenia czyszczenia wszystkich tokenów
      ignoreExpiry = false, // Nowa opcja - ignoruje datę wygaśnięcia
    } = body;

    console.log("Parametry czyszczenia tokenów:", {
      removeExpired,
      removeRevoked,
      olderThan,
      dryRun,
      forceCleanup,
      ignoreExpiry,
    });

    // Specjalny tryb diagnostyczny - pokaż strukturę tokenów i wymuś usunięcie wszystkich
    if (forceCleanup) {
      try {
        const collection = await mongodbService.getCollection(
          dbName,
          COLLECTION_NAME
        );

        // Pobierz sample tokenów by sprawdzić ich strukturę
        const tokenSamples = await collection.find().limit(3).toArray();
        console.log(
          "Przykładowe tokeny:",
          JSON.stringify(tokenSamples, null, 2)
        );

        // Pobierz całkowitą liczbę tokenów
        const totalTokens = await collection.countDocuments();

        let deleteResult = { deletedCount: 0 };

        // Usuń wszystkie tokeny jeśli nie jest to tryb testowy
        if (!dryRun) {
          deleteResult = await collection.deleteMany({});
          console.log("Wynik usuwania wszystkich tokenów:", deleteResult);
        }

        return NextResponse.json(
          {
            message: dryRun
              ? `Znaleziono ${totalTokens} tokenów do usunięcia (tryb testowy)`
              : `Usunięto wszystkie tokeny: ${deleteResult.deletedCount} z ${totalTokens}`,
            result: {
              totalRemoved: totalTokens,
              debug: {
                tokenSamples,
                totalTokensBefore: totalTokens,
                deleteResult: !dryRun ? deleteResult : null,
              },
            },
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Błąd podczas wymuszania czyszczenia:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Nieznany błąd";
        return NextResponse.json(
          {
            message: "Błąd podczas wymuszania czyszczenia tokenów",
            error: errorMessage,
          },
          { status: 500 }
        );
      }
    }

    // Standardowe czyszczenie tokenów przez jwtService
    const result = await jwtService.cleanupTokens({
      removeExpired,
      removeRevoked,
      olderThan,
      dryRun,
      ignoreExpiry,
    });

    console.log("Wynik czyszczenia tokenów:", result);

    const message = dryRun
      ? "Przeprowadzono symulację czyszczenia tokenów"
      : `Tokeny zostały pomyślnie wyczyszczone (usunięto ${result.totalRemoved} tokenów)`;

    return NextResponse.json(
      {
        message,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd podczas czyszczenia tokenów:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd";

    return NextResponse.json(
      {
        message: "Wystąpił błąd podczas czyszczenia tokenów",
        error: errorMessage,
        stack:
          error instanceof Error && process.env.NODE_ENV === "development"
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
