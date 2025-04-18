import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { User } from "@/backend/models/User";

// Aktualizuj użytkownika
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const userId = params.id;

    // Sprawdź czy użytkownik istnieje
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    // Pobierz dane do aktualizacji
    const updateData = await request.json();
    const { role, active, locked } = updateData;

    // Weryfikacja danych
    if (role && !["prisoner", "partner", "admin", "moderator"].includes(role)) {
      return NextResponse.json(
        { message: "Nieprawidłowa rola" },
        { status: 400 }
      );
    }

    // Przygotuj dane do aktualizacji
    const updates: Partial<User> = {
      updatedAt: new Date(),
    };

    if (role !== undefined) updates.role = role;
    if (active !== undefined) updates.active = active;
    if (locked !== undefined) {
      updates.locked = locked;
      if (locked) {
        // Jeśli blokujemy konto, zwiększ licznik prób logowania i ustaw datę blokady
        updates.loginAttempts = 5;
        updates.lockedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dni
      } else {
        // Jeśli odblokowujemy, resetuj licznik
        updates.loginAttempts = 0;
        updates.lockedUntil = undefined;
      }
    }

    // Aktualizuj użytkownika
    await mongodbService.updateDocument(
      dbName,
      "users",
      { id: userId },
      updates
    );

    // Pobierz zaktualizowanego użytkownika
    const updatedUser = await mongodbService.findDocument<User>(
      dbName,
      "users",
      { id: userId }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Nie udało się pobrać zaktualizowanego użytkownika" },
        { status: 500 }
      );
    }

    // Usuń wrażliwe dane
    const { passwordHash, verificationCode, resetPasswordToken, ...safeUser } =
      updatedUser;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Błąd podczas aktualizacji użytkownika:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji użytkownika" },
      { status: 500 }
    );
  }
}

// Usuń użytkownika
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const userId = params.id;

    // Sprawdź czy użytkownik istnieje
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdź czy to nie jest ostatni administrator
    if (user.role === "admin") {
      const adminCount = await mongodbService
        .getCollection(dbName, "users")
        .then((collection) => collection.countDocuments({ role: "admin" }));

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Nie można usunąć ostatniego administratora" },
          { status: 400 }
        );
      }
    }

    // Sprawdź czy użytkownik ma profil
    if (user.profileId) {
      // Usuń profil użytkownika
      await mongodbService.deleteDocument(dbName, "profiles", {
        id: user.profileId,
      });
    }

    // Usuń tokeny użytkownika
    await mongodbService.deleteDocument(dbName, "tokens", { userId: user.id });

    // Usuń użytkownika
    await mongodbService.deleteDocument(dbName, "users", { id: userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Błąd podczas usuwania użytkownika:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas usuwania użytkownika" },
      { status: 500 }
    );
  }
}

// Pobierz szczegóły pojedynczego użytkownika
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    const userId = params.id;

    // Pobierz użytkownika
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    // Usuń wrażliwe dane
    const { passwordHash, verificationCode, resetPasswordToken, ...safeUser } =
      user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Błąd podczas pobierania użytkownika:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania użytkownika" },
      { status: 500 }
    );
  }
}
