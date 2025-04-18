import { NextRequest, NextResponse } from "next/server";
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

    // Pobierz parametry z ciała żądania
    const body = await request.json();
    const { dryRun = true } = body;

    console.log(
      "Wymuszenie czyszczenia wszystkich tokenów. Tryb testowy:",
      dryRun
    );

    try {
      const collection = await mongodbService.getCollection(
        dbName,
        COLLECTION_NAME
      );

      // Pobierz sample tokenów by sprawdzić ich strukturę
      const tokenSamples = await collection.find().limit(3).toArray();

      // Pobierz całkowitą liczbę tokenów
      const totalTokens = await collection.countDocuments();

      // Struktura wynikowa
      const result = {
        totalFound: totalTokens,
        totalRemoved: 0,
        debug: {
          tokenSamples,
          dryRun,
        },
      };

      // Usuń wszystkie tokeny jeśli nie jest to tryb testowy
      if (!dryRun) {
        const deleteResult = await collection.deleteMany({});
        result.totalRemoved = deleteResult.deletedCount;
        console.log("Wynik usuwania wszystkich tokenów:", deleteResult);
      }

      return NextResponse.json(
        {
          message: dryRun
            ? `Symulacja: znaleziono ${totalTokens} tokenów do usunięcia`
            : `Usunięto wszystkie tokeny: ${result.totalRemoved} z ${totalTokens}`,
          result,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error("Błąd podczas przetwarzania żądania:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd";
    return NextResponse.json(
      {
        message: "Wystąpił błąd podczas przetwarzania żądania",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
