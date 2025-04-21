import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Match } from "@/backend/models/Match";
import { Profile } from "@/backend/models/Profile";
import { Message } from "@/backend/models/Message";

// GET - Pobierz listę konwersacji użytkownika
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

    // Pobierz wszystkie dopasowania (matche) tego użytkownika
    const matches = await mongodbService.findDocuments<Match>(
      dbName,
      "matches",
      {
        $or: [{ prisonerId: userId }, { partnerId: userId }],
        status: "accepted", // Tylko zaakceptowane dopasowania
      }
    );

    // Przygotuj listę konwersacji
    const conversations = await Promise.all(
      matches.map(async (match) => {
        // Określamy ID partnera
        const partnerId =
          match.prisonerId === userId ? match.partnerId : match.prisonerId;

        // Pobierz profil partnera - najpierw próbujemy po userId
        let partnerProfile = await mongodbService.findDocument<Profile>(
          dbName,
          "profiles",
          {
            userId: partnerId,
          }
        );

        // Jeśli nie znaleziono po userId, próbujemy znaleźć po id
        if (!partnerProfile) {
          partnerProfile = await mongodbService.findDocument<Profile>(
            dbName,
            "profiles",
            {
              id: partnerId,
            }
          );
        }

        // Pobierz ostatnią wiadomość
        const lastMessages = await mongodbService.findDocuments<Message>(
          dbName,
          "messages",
          { matchId: match.id, moderationStatus: "approved" },
          { sort: { createdAt: -1 }, limit: 1 }
        );

        const lastMessage = lastMessages.length > 0 ? lastMessages[0] : null;

        // Pobierz liczbę nieprzeczytanych wiadomości
        const unreadCount = await mongodbService.countDocuments(
          dbName,
          "messages",
          {
            matchId: match.id,
            recipientId: userId,
            readStatus: false,
            moderationStatus: "approved",
          }
        );

        const partnerName = partnerProfile
          ? `${partnerProfile.firstName} ${partnerProfile.lastName}`
          : "Użytkownik";

        return {
          matchId: match.id,
          partnerId,
          partnerName,
          partnerImg: partnerProfile?.photoUrl,
          lastMessage: lastMessage?.content || "Brak wiadomości",
          lastMessageDate: lastMessage?.createdAt || match.lastInteraction,
          unreadCount,
        };
      })
    );

    // Sortuj konwersacje według daty ostatniej wiadomości (od najnowszej)
    conversations.sort((a, b) => {
      return (
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
      );
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Błąd podczas pobierania konwersacji:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania konwersacji" },
      { status: 500 }
    );
  }
}
