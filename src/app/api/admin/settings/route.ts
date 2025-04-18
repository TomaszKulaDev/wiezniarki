import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticatedRequest,
  roleMiddleware,
} from "@/backend/middlewares/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";

const dbName = process.env.MONGODB_DB_NAME || "wiezniarki";

// Handler pobierający ustawienia systemowe
async function getSettingsHandler(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Pobierz ustawienia z bazy danych
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Jeśli ustawienia nie istnieją, zwróć domyślne
    if (!settings) {
      const defaultSettings = {
        name: "systemSettings",
        maintenance: {
          enabled: false,
          message: "Trwają prace konserwacyjne. Prosimy spróbować później.",
        },
        registration: {
          enabled: true,
          requireVerification: true,
        },
        database: {
          cleanupInterval: 30,
          backupEnabled: true,
        },
        notifications: {
          emailEnabled: true,
          adminEmail: "admin@wiezniarki.pl",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Zapisz domyślne ustawienia w bazie danych
      await mongodbService.insertDocument(dbName, "settings", defaultSettings);

      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Błąd podczas pobierania ustawień systemowych:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania ustawień systemowych" },
      { status: 500 }
    );
  }
}

// Handler aktualizujący ustawienia systemowe
async function updateSettingsHandler(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Pobierz dane do aktualizacji
    const updateData = await req.json();

    // Walidacja danych
    if (!updateData || typeof updateData !== "object") {
      return NextResponse.json(
        { message: "Nieprawidłowe dane ustawień systemowych" },
        { status: 400 }
      );
    }

    // Przygotuj dane do aktualizacji
    const updates = {
      ...updateData,
      name: "systemSettings", // Zapewnienie, że to są ustawienia systemowe
      updatedAt: new Date(),
    };

    // Sprawdź czy ustawienia już istnieją
    const existingSettings = await mongodbService.findDocument(
      dbName,
      "settings",
      { name: "systemSettings" }
    );

    if (existingSettings) {
      // Aktualizuj istniejące ustawienia
      await mongodbService.updateDocument(
        dbName,
        "settings",
        { name: "systemSettings" },
        updates
      );
    } else {
      // Utwórz nowe ustawienia
      updates.createdAt = new Date();
      await mongodbService.insertDocument(dbName, "settings", updates);
    }

    return NextResponse.json({
      success: true,
      message: "Ustawienia systemowe zostały zaktualizowane",
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ustawień systemowych:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji ustawień systemowych" },
      { status: 500 }
    );
  }
}

// Pobierz ustawienia systemowe
export function GET(request: NextRequest) {
  return roleMiddleware(request as AuthenticatedRequest, getSettingsHandler, [
    "admin",
  ]);
}

// Aktualizuj ustawienia systemowe
export function POST(request: NextRequest) {
  return roleMiddleware(
    request as AuthenticatedRequest,
    updateSettingsHandler,
    ["admin"]
  );
}
