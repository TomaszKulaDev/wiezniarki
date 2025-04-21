import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Match } from "@/backend/models/Match";

// Funkcja pomocnicza do wydobycia ID z URL
function getIdFromUrl(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/\/api\/matches\/(.+)\/status/);
  return match ? match[1] : null;
}

// PATCH - Aktualizuj status dopasowania
export async function PATCH(request: NextRequest) {
  try {
    // Weryfikacja autoryzacji
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak autoryzacji" },
        { status: authResult.status || 401 }
      );
    }

    const { userId } = authResult;
    const matchId = getIdFromUrl(request);

    if (!matchId) {
      return NextResponse.json(
        { message: "ID dopasowania jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz dane z żądania
    const body = await request.json();
    const { status } = body;

    if (
      !status ||
      !["pending", "accepted", "rejected", "blocked"].includes(status)
    ) {
      return NextResponse.json(
        { message: "Nieprawidłowy status dopasowania" },
        { status: 400 }
      );
    }

    // Pobierz dopasowanie
    const match = await mongodbService.findDocument<Match>(dbName, "matches", {
      id: matchId,
    });

    if (!match) {
      return NextResponse.json(
        { message: "Dopasowanie nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdź uprawnienia - tylko osoba, która jest częścią dopasowania może je aktualizować
    if (match.prisonerId !== userId && match.partnerId !== userId) {
      return NextResponse.json(
        { message: "Brak uprawnień do aktualizacji tego dopasowania" },
        { status: 403 }
      );
    }

    // Aktualizuj status dopasowania
    await mongodbService.updateDocument(
      dbName,
      "matches",
      { id: matchId },
      { status, updatedAt: new Date() }
    );

    // Pobierz zaktualizowane dopasowanie
    const updatedMatch = await mongodbService.findDocument<Match>(
      dbName,
      "matches",
      { id: matchId }
    );

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error("Błąd podczas aktualizacji statusu dopasowania:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji statusu dopasowania" },
      { status: 500 }
    );
  }
}
