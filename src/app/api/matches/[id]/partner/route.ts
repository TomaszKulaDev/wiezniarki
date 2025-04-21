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

    if (!match) {
      return NextResponse.json(
        { message: "Match nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdź uprawnienia do matcha
    if (match.prisonerId !== userId && match.partnerId !== userId) {
      return NextResponse.json(
        { message: "Brak dostępu do tego matcha" },
        { status: 403 }
      );
    }

    // Określ ID partnera
    const partnerId =
      match.prisonerId === userId ? match.partnerId : match.prisonerId;

    // Pobierz dane partnera
    const partner = await mongodbService.findDocument<User>(dbName, "users", {
      id: partnerId,
    });

    if (!partner) {
      return NextResponse.json(
        { message: "Partner nie istnieje" },
        { status: 404 }
      );
    }

    // Pobierz profil partnera
    const profile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { userId: partnerId }
    );

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
        image: profile?.photos?.[0] || null,
        role: partner.role,
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
