import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Message } from "@/backend/models/Message";

// GET - Pobierz wiadomości oczekujące na moderację
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora/moderatora
    const authResult = await authMiddleware(request, ["admin", "moderator"]);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Pobierz wiadomości oczekujące na moderację
    const collection = await mongodbService.getCollection<Message>(
      dbName,
      "messages"
    );
    const messages = await collection
      .find({ moderationStatus: "pending" })
      .sort({ createdAt: 1 }) // Najstarsze pierwsze
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({
      moderationStatus: "pending",
    });

    return NextResponse.json({
      messages,
      pagination: {
        total,
        offset,
        limit,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości do moderacji:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania wiadomości do moderacji" },
      { status: 500 }
    );
  }
}

// POST - Aktualizuj status moderacji wiadomości
export async function POST(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora/moderatora
    const authResult = await authMiddleware(request, ["admin", "moderator"]);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const body = await request.json();
    const { messageId, status, reason } = body;

    // Walidacja danych
    if (!messageId || !status) {
      return NextResponse.json(
        { message: "Brakujące wymagane dane (messageId, status)" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Nieprawidłowy status moderacji (approved/rejected)" },
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

    // Aktualizuj status moderacji
    const update: Partial<Message> = {
      moderationStatus: status as Message["moderationStatus"],
      updatedAt: new Date(),
    };

    if (status === "rejected" && reason) {
      update.moderationReason = reason;
    }

    await mongodbService.updateDocument(
      dbName,
      "messages",
      { id: messageId },
      update
    );

    return NextResponse.json({
      message: `Wiadomość została ${
        status === "approved" ? "zatwierdzona" : "odrzucona"
      }`,
      status,
    });
  } catch (error) {
    console.error("Błąd podczas moderacji wiadomości:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas moderacji wiadomości" },
      { status: 500 }
    );
  }
}
