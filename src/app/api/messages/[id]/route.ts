import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Message } from "@/backend/models/Message";

// Funkcja pomocnicza do wydobycia ID z URL
function getIdFromUrl(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/\/api\/messages\/(.+)/);
  return match ? match[1] : null;
}

// GET - Pobierz pojedynczą wiadomość
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
    const messageId = getIdFromUrl(request);

    if (!messageId) {
      return NextResponse.json(
        { message: "ID wiadomości jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz wiadomość
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id: messageId }
    );

    if (!message) {
      return NextResponse.json(
        { message: "Wiadomość nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdź uprawnienia do wiadomości
    if (message.senderId !== userId && message.recipientId !== userId) {
      return NextResponse.json(
        { message: "Brak dostępu do tej wiadomości" },
        { status: 403 }
      );
    }

    // Jeśli użytkownik jest odbiorcą i wiadomość nie została przeczytana, oznacz jako przeczytaną
    if (
      message.recipientId === userId &&
      !message.readStatus &&
      message.moderationStatus === "approved"
    ) {
      await mongodbService.updateDocument(
        dbName,
        "messages",
        { id: messageId },
        { readStatus: true, updatedAt: new Date() }
      );
      message.readStatus = true;
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania wiadomości" },
      { status: 500 }
    );
  }
}

// PATCH - Aktualizuj wiadomość (tylko oznaczanie jako przeczytane)
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
    const messageId = getIdFromUrl(request);

    if (!messageId) {
      return NextResponse.json(
        { message: "ID wiadomości jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz wiadomość
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id: messageId }
    );

    if (!message) {
      return NextResponse.json(
        { message: "Wiadomość nie istnieje" },
        { status: 404 }
      );
    }

    // Tylko odbiorca może oznaczyć wiadomość jako przeczytaną
    if (message.recipientId !== userId) {
      return NextResponse.json(
        { message: "Brak uprawnień do aktualizacji tej wiadomości" },
        { status: 403 }
      );
    }

    // Aktualizuj status przeczytania
    await mongodbService.updateDocument(
      dbName,
      "messages",
      { id: messageId },
      { readStatus: true, updatedAt: new Date() }
    );

    return NextResponse.json({
      message: "Status wiadomości zaktualizowany",
      readStatus: true,
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wiadomości:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji wiadomości" },
      { status: 500 }
    );
  }
}

// DELETE - Usuń wiadomość
export async function DELETE(request: NextRequest) {
  try {
    // Weryfikacja autoryzacji
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak autoryzacji" },
        { status: authResult.status || 401 }
      );
    }

    const { userId, role } = authResult;
    const messageId = getIdFromUrl(request);

    if (!messageId) {
      return NextResponse.json(
        { message: "ID wiadomości jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz wiadomość
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id: messageId }
    );

    if (!message) {
      return NextResponse.json(
        { message: "Wiadomość nie istnieje" },
        { status: 404 }
      );
    }

    // Tylko nadawca, administrator lub moderator może usunąć wiadomość
    if (message.senderId !== userId && !["admin", "moderator"].includes(role)) {
      return NextResponse.json(
        { message: "Brak uprawnień do usunięcia tej wiadomości" },
        { status: 403 }
      );
    }

    // Usuń wiadomość
    await mongodbService.deleteDocument(dbName, "messages", { id: messageId });

    return NextResponse.json({
      message: "Wiadomość została usunięta",
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wiadomości:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas usuwania wiadomości" },
      { status: 500 }
    );
  }
}
