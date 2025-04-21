import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { messageService } from "@/backend/services/messageService";

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
    const count = await messageService.getUnreadMessageCount(userId);

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
