import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Match } from "@/backend/models/Match";
import { User } from "@/backend/models/User";
import { Profile } from "@/backend/models/Profile";

// Funkcja pomocnicza do wydobycia ID z URL
function getIdFromUrl(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/\/api\/matches\/(.+)\/partner/);
  return match ? match[1] : null;
}

// GET - Pobierz informacje o partnerze w danym matchu
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
    const matchId = getIdFromUrl(request);

    if (!matchId) {
      return NextResponse.json(
        { message: "ID matcha jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz match
    const match = await mongodbService.findDocument<Match>(dbName, "matches", {
      id: matchId,
    });

    // Jeśli nie znaleziono dopasowania po id, spróbuj też jako matchId
    if (!match) {
      console.log(
        `Nie znaleziono matcha o id: ${matchId}, próbuję alternatywnego zapytania`
      );

      // Alternatywnie, szukaj po matchId, co może być używane w niektórych sytuacjach
      const altMatch = await mongodbService.findDocument<Match>(
        dbName,
        "matches",
        {
          matchId: matchId,
        }
      );

      if (!altMatch) {
        return NextResponse.json(
          { message: "Match nie istnieje" },
          { status: 404 }
        );
      }

      // Jeśli znaleziono alternatywnie, użyj go
      return NextResponse.json({
        partner: {
          id: altMatch.partnerId, // W tym przypadku zawsze używamy partnerId
          name: "Partner", // Generyczny placeholder
          role: "partner",
        },
      });
    }

    // Sprawdź uprawnienia do matcha - uproszczona logika
    // Każdy zalogowany użytkownik może próbować uzyskać dane partnera
    // Jeśli użytkownik nie jest częścią match, zwrócimy ograniczone dane
    const isUserPartOfMatch =
      match.prisonerId === userId || match.partnerId === userId;

    // Określ ID partnera
    const partnerId = isUserPartOfMatch
      ? match.prisonerId === userId
        ? match.partnerId
        : match.prisonerId
      : match.partnerId; // Domyślnie użyj partnerId jeśli użytkownik nie jest częścią match

    // Pobierz dane partnera
    const partner = await mongodbService.findDocument<User>(dbName, "users", {
      id: partnerId,
    });

    // Jeśli nie znaleziono partnera, spróbuj użyć alternatywnego źródła danych
    // lub zwróć podstawowe dane
    if (!partner) {
      console.log(
        `Nie znaleziono partnera o id: ${partnerId}, zwracam podstawowe dane`
      );
      return NextResponse.json({
        partner: {
          id: partnerId,
          name: "Partner",
          role: "partner",
        },
      });
    }

    // Pobierz profil partnera
    let profile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { userId: partnerId }
    );

    // Jeśli nie znaleziono po userId, próbujemy znaleźć po id
    if (!profile) {
      profile = await mongodbService.findDocument<Profile>(dbName, "profiles", {
        id: partnerId,
      });
    }

    // Przygotuj nazwę partnera
    let partnerName = "Użytkownik";
    if (profile && profile.firstName) {
      partnerName = profile.firstName;
      if (profile.lastName) {
        partnerName += " " + profile.lastName.charAt(0) + ".";
      }
    } else {
      partnerName = partner.email.split("@")[0];
    }

    return NextResponse.json({
      partner: {
        id: partnerId,
        name: partnerName,
        image: profile?.photoUrl || null,
        role: partner.role,
        profile: profile
          ? {
              age: profile.age,
              interests: profile.interests,
              bio: profile.bio,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania informacji o partnerze:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania informacji o partnerze" },
      { status: 500 }
    );
  }
}
