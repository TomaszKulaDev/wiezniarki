import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";

// GET - Pobierz liczbę nieprzeczytanych wiadomości dla zalogowanego użytkownika
export async function GET(request: NextRequest) {
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

    // Pobierz liczbę nieprzeczytanych wiadomości
    const count = await mongodbService.countDocuments(dbName, "messages", {
      recipientId: userId,
      readStatus: false,
      moderationStatus: "approved",
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error(
      "Błąd podczas pobierania liczby nieprzeczytanych wiadomości:",
      error
    );
    return NextResponse.json(
      {
        message:
          "Wystąpił błąd podczas pobierania liczby nieprzeczytanych wiadomości",
      },
      { status: 500 }
    );
  }
}
