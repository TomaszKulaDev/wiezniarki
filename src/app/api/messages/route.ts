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

    // Kolekcja wiadomości
    const collection = await mongodbService.getCollection<Message>(
      dbName,
      "messages"
    );

    // Budowanie query w zależności od parametrów
    const query: any = {};

    // Zawsze filtruj po matchId jeśli jest podane
    if (matchId) {
      query.matchId = matchId;
    } else {
      // Tylko gdy nie ma matchId, filtruj po użytkowniku
      query.$or = [{ senderId: userId }, { recipientId: userId }];
    }

    if (unreadOnly) {
      query.readStatus = false;
      query.recipientId = userId;
      query.moderationStatus = "approved";
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
