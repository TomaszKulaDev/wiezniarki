import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Message } from "@/backend/models/Message";
import { Match } from "@/backend/models/Match";
import { User } from "@/backend/models/User";
import { Profile } from "@/backend/models/Profile";

// GET - Pobierz wszystkie konwersacje (matche) dla zalogowanego użytkownika
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

    // Pobierz matche użytkownika
    const matchesCollection = await mongodbService.getCollection(
      dbName,
      "matches"
    );
    const matches = await matchesCollection
      .find({
        $or: [{ prisonerId: userId }, { partnerId: userId }],
        status: "accepted", // Tylko zaakceptowane matche
      })
      .sort({ lastInteraction: -1 }) // Najnowsze konwersacje na górze
      .toArray();

    // Jeśli nie ma matchów, zwróć pustą tablicę konwersacji
    if (matches.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // Przygotuj dane do pobierania wiadomości i informacji o użytkownikach
    const matchIds = matches.map((match) => match.id);
    const partnerIds = matches.map((match) =>
      match.prisonerId === userId ? match.partnerId : match.prisonerId
    );

    // Pobierz ostatnie wiadomości dla każdego matcha
    const messagesCollection = await mongodbService.getCollection(
      dbName,
      "messages"
    );

    // Pobierz informacje o użytkownikach (partnerach)
    const usersCollection = await mongodbService.getCollection(dbName, "users");
    const partners = await usersCollection
      .find({
        id: { $in: partnerIds },
      })
      .project({ passwordHash: 0, verificationCode: 0, resetPasswordToken: 0 })
      .toArray();

    // Pobierz profile użytkowników
    const profilesCollection = await mongodbService.getCollection(
      dbName,
      "profiles"
    );
    const profiles = await profilesCollection
      .find({
        userId: { $in: partnerIds },
      })
      .toArray();

    // Pobierz liczbę nieprzeczytanych wiadomości dla każdego matcha
    const conversations = await Promise.all(
      matches.map(async (match) => {
        // Określ ID partnera
        const partnerId =
          match.prisonerId === userId ? match.partnerId : match.prisonerId;

        // Znajdź partnera
        const partner = partners.find((user) => user.id === partnerId);

        // Znajdź profil partnera
        const profile = profiles.find(
          (profile) => profile.userId === partnerId
        );

        // Pobierz ostatnią wiadomość
        const lastMessage = await messagesCollection
          .find({
            matchId: match.id,
            moderationStatus: "approved", // Tylko zatwierdzone wiadomości
          })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();

        // Policz nieprzeczytane wiadomości
        const unreadCount = await messagesCollection.countDocuments({
          matchId: match.id,
          recipientId: userId,
          readStatus: false,
          moderationStatus: "approved",
        });

        // Przygotuj nazwę partnera
        let partnerName = "Użytkownik";
        if (profile && profile.firstName) {
          partnerName = profile.firstName;
          if (profile.lastName) {
            partnerName += " " + profile.lastName.charAt(0) + ".";
          }
        } else if (partner) {
          partnerName = partner.email.split("@")[0];
        }

        return {
          matchId: match.id,
          partnerId,
          partnerName,
          partnerImg: profile?.photos?.[0] || null,
          lastMessage: lastMessage[0]?.content || "Rozpocznij konwersację...",
          lastMessageDate: lastMessage[0]?.createdAt || match.createdAt,
          unreadCount,
          status: match.status,
        };
      })
    );

    // Sortuj konwersacje - najpierw te z nieprzeczytanymi wiadomościami, potem według daty
    conversations.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

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
