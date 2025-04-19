import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Profile } from "@/backend/models/Profile";
import { User } from "@/backend/models/User";

// Funkcja pomocnicza do wyodrębniania ID z URL
function getIdFromUrl(request: NextRequest): string | null {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  return pathParts[pathParts.length - 1] || null;
}

// Pobierz szczegóły profilu
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const profileId = getIdFromUrl(request);

    if (!profileId) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz profil
    const profile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { id: profileId }
    );

    if (!profile) {
      return NextResponse.json(
        { message: "Profil nie istnieje" },
        { status: 404 }
      );
    }

    // Znajdź użytkownika powiązanego z profilem
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      profileId,
    });

    // Dodaj informacje o użytkowniku do odpowiedzi, jeśli istnieje
    const response: any = { ...profile };

    if (user) {
      response.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        active: user.active,
        locked: user.locked,
        verified: user.verified,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Błąd podczas pobierania profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania profilu" },
      { status: 500 }
    );
  }
}

// Usuń profil
export async function DELETE(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const profileId = getIdFromUrl(request);

    if (!profileId) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Sprawdź czy profil istnieje
    const profile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { id: profileId }
    );

    if (!profile) {
      return NextResponse.json(
        { message: "Profil nie istnieje" },
        { status: 404 }
      );
    }

    // Znajdź i zaktualizuj użytkownika powiązanego z profilem
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      profileId,
    });

    if (user) {
      // Usuń odniesienie do profilu
      await mongodbService.updateDocument(
        dbName,
        "users",
        { id: user.id },
        { profileId: undefined, updatedAt: new Date() }
      );
    }

    // Usuń profil
    await mongodbService.deleteDocument(dbName, "profiles", { id: profileId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Błąd podczas usuwania profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas usuwania profilu" },
      { status: 500 }
    );
  }
}

// Aktualizuj profil
export async function PATCH(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const profileId = getIdFromUrl(request);

    if (!profileId) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Sprawdź czy profil istnieje
    const profile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { id: profileId }
    );

    if (!profile) {
      return NextResponse.json(
        { message: "Profil nie istnieje" },
        { status: 404 }
      );
    }

    // Pobierz dane do aktualizacji
    const updateData = await request.json();

    // Przygotuj dane do aktualizacji
    const updates: Partial<Profile> = {
      updatedAt: new Date(),
    };

    // Przeniesienie dozwolonych pól
    const allowedFields: (keyof Profile)[] = [
      "firstName",
      "lastName",
      "age",
      "facility",
      "interests",
      "skills",
      "bio",
      "education",
      "goals",
      "photoUrl",
      "contactPreferences",
      "matchingPreferences",
      "relationshipStatus",
      "personalityTraits",
      "hobbies",
    ];

    for (const field of allowedFields) {
      if (field in updateData) {
        (updates as any)[field] = updateData[field];
      }
    }

    // Aktualizuj profil
    await mongodbService.updateDocument(
      dbName,
      "profiles",
      { id: profileId },
      updates
    );

    // Pobierz zaktualizowany profil
    const updatedProfile = await mongodbService.findDocument<Profile>(
      dbName,
      "profiles",
      { id: profileId }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji profilu" },
      { status: 500 }
    );
  }
}
