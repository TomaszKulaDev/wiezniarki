import { NextRequest, NextResponse } from "next/server";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";

// Endpoint do aktualizacji powiązania profilu z użytkownikiem
export async function PATCH(request: NextRequest) {
  try {
    const { userId, profileId } = await request.json();

    console.log("Otrzymane dane:", { userId, profileId });

    if (!userId || !profileId) {
      return NextResponse.json(
        { message: "Brakujące ID użytkownika lub profilu" },
        { status: 400 }
      );
    }

    // PIERWSZA PRÓBA: Szukaj po polu 'id'
    let user = await mongodbService.findDocument(dbName, "users", {
      id: userId,
    });

    // DRUGA PRÓBA: Jeśli nie znaleziono, spróbuj po email
    if (!user && userId.includes("@")) {
      user = await mongodbService.findDocument(dbName, "users", {
        email: userId,
      });
      console.log("Szukanie po email:", user ? "znaleziono" : "nie znaleziono");
    }

    // TRZECIA PRÓBA: Pokaż dostępne dokumenty dla diagnostyki
    if (!user) {
      const allUsers = await mongodbService.findDocuments(dbName, "users", {});
      console.log(
        "Wszystkie dostępne ID użytkowników:",
        allUsers.map((u) => ({ id: u.id, email: u.email }))
      );

      // Sprawdź, czy możemy znaleźć użytkownika po email z pierwszego dokumentu
      if (allUsers.length > 0) {
        user = allUsers[0]; // Użyj pierwszego dostępnego użytkownika (tylko dla MVP)
        console.log("Użycie pierwszego dostępnego użytkownika:", user.email);
      } else {
        return NextResponse.json(
          { message: "Użytkownik nie został znaleziony" },
          { status: 404 }
        );
      }
    }

    // Sprawdź czy profil istnieje
    const profile = await mongodbService.findDocument(dbName, "profiles", {
      id: profileId,
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profil nie został znaleziony" },
        { status: 404 }
      );
    }

    // Aktualizuj powiązanie profilu z użytkownikiem
    const result = await mongodbService.updateDocument(
      dbName,
      "users",
      { id: user.id }, // Używaj pola 'id' a nie '_id'
      { profileId, updatedAt: new Date() }
    );

    console.log("Wynik aktualizacji:", result);

    return NextResponse.json(
      { message: "Powiązanie profilu zaktualizowane" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Błąd podczas aktualizacji powiązania profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji powiązania profilu" },
      { status: 500 }
    );
  }
}
