import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { messageService } from "@/backend/services/messageService";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Message } from "@/backend/models/Message";

// GET - Pobierz wiadomości dla zalogowanego użytkownika
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
    const url = new URL(request.url);

    // Parametry filtrowania i paginacji
    const matchId = url.searchParams.get("matchId");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const unreadOnly = url.searchParams.get("unread") === "true";

    // Jeśli podano matchId, sprawdź czy użytkownik ma do niego dostęp
    if (matchId) {
      const match = await mongodbService.findDocument(dbName, "matches", {
        id: matchId,
      });

      if (!match) {
        return NextResponse.json(
          { message: "Match nie istnieje" },
          { status: 404 }
        );
      }

      // Sprawdź czy użytkownik jest uczestnikiem tego matcha
      if (match.prisonerId !== userId && match.partnerId !== userId) {
        return NextResponse.json(
          { message: "Brak dostępu do tej konwersacji" },
          { status: 403 }
        );
      }

      // Sprawdź czy match jest aktywny
      if (match.status !== "accepted") {
        return NextResponse.json(
          { message: "Ta konwersacja nie jest aktywna" },
          { status: 403 }
        );
      }
    }

    // Kolekcja wiadomości
    const collection = await mongodbService.getCollection<Message>(
      dbName,
      "messages"
    );

    // Budowanie query w zależności od parametrów
    const query: any = {};

    // Zawsze filtruj po użytkowniku
    query.$and = [{ $or: [{ senderId: userId }, { recipientId: userId }] }];

    // Jeśli podano matchId, dodaj go do warunków
    if (matchId) {
      query.$and.push({ matchId });
    }

    if (unreadOnly) {
      query.$and.push({
        readStatus: false,
        recipientId: userId,
        moderationStatus: "approved",
      });
    }

    // Pobieranie wiadomości z bazy danych
    const messages = await collection
      .find(query)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Pobranie całkowitej liczby wiadomości dla paginacji
    const total = await collection.countDocuments(query);

    return NextResponse.json({
      messages,
      pagination: {
        total,
        offset,
        limit,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania wiadomości" },
      { status: 500 }
    );
  }
}

// POST - Utwórz nową wiadomość
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { matchId, recipientId, content, attachments } = body;

    // Walidacja danych
    if (!matchId || !recipientId || !content) {
      return NextResponse.json(
        { message: "Brakujące wymagane dane (matchId, recipientId, content)" },
        { status: 400 }
      );
    }

    // Pobierz dane o zalogowanym użytkowniku, aby określić senderType
    const user = await mongodbService.findDocument(dbName, "users", {
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Nie znaleziono użytkownika" },
        { status: 404 }
      );
    }

    const senderType = user.role === "prisoner" ? "prisoner" : "partner";

    // Utwórz wiadomość
    const newMessage: Message = {
      id: Date.now().toString(),
      matchId,
      senderId: userId,
      senderType,
      recipientId,
      content,
      attachments,
      readStatus: false,
      moderationStatus: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Zapisz w bazie danych
    await mongodbService.insertDocument(dbName, "messages", newMessage);

    // Aktualizuj licznik wiadomości w matchu
    const match = await mongodbService.findDocument(dbName, "matches", {
      id: matchId,
    });
    if (match) {
      await mongodbService.updateDocument(
        dbName,
        "matches",
        { id: matchId },
        {
          messageCount: (match.messageCount || 0) + 1,
          lastInteraction: new Date(),
          updatedAt: new Date(),
        }
      );
    }

    return NextResponse.json(
      {
        message: "Wiadomość została wysłana",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Błąd podczas tworzenia wiadomości:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Wystąpił błąd podczas wysyłania wiadomości";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
