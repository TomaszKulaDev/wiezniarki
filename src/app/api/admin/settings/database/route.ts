import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticatedRequest,
  roleMiddleware,
} from "@/backend/middlewares/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";

const dbName = process.env.MONGODB_DB_NAME || "wiezniarki";

// Handler aktualizujący ustawienia bazy danych
async function updateDatabaseSettingsHandler(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Pobierz dane do aktualizacji
    const updateData = await req.json();

    // Walidacja
    if (updateData.cleanupInterval !== undefined) {
      const cleanupInterval = Number(updateData.cleanupInterval);
      if (isNaN(cleanupInterval) || cleanupInterval <= 0) {
        return NextResponse.json(
          { message: "Nieprawidłowa wartość dla cleanupInterval" },
          { status: 400 }
        );
      }
    }

    // Pobierz aktualne ustawienia
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Przygotuj dane do aktualizacji
    const dbSettings = settings?.database || {};
    const updatedSettings = {
      ...settings,
      database: {
        ...dbSettings,
        cleanupInterval:
          updateData.cleanupInterval !== undefined
            ? Number(updateData.cleanupInterval)
            : dbSettings.cleanupInterval,
      },
      updatedAt: new Date(),
    };

    // Jeśli ustawienia istnieją, zaktualizuj je
    if (settings) {
      await mongodbService.updateDocument(
        dbName,
        "settings",
        { name: "systemSettings" },
        updatedSettings
      );
    } else {
      // Utwórz nowe ustawienia z domyślnymi wartościami i przekazaną wartością cleanupInterval
      await mongodbService.insertDocument(dbName, "settings", {
        name: "systemSettings",
        database: {
          cleanupInterval: Number(updateData.cleanupInterval) || 30,
          backupEnabled: false,
        },
        registration: {
          enabled: true,
          requireVerification: true,
        },
        maintenance: {
          enabled: false,
          message: "Trwają prace konserwacyjne. Prosimy spróbować później.",
        },
        notifications: {
          emailEnabled: true,
          adminEmail: "admin@wiezniarki.pl",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Ustawienia bazy danych zostały zaktualizowane",
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ustawień bazy danych:", error);
    return NextResponse.json(
      {
        message: "Wystąpił błąd podczas aktualizacji ustawień bazy danych",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Pobierz ustawienia bazy danych
export async function GET(request: NextRequest) {
  return roleMiddleware(
    request as AuthenticatedRequest,
    async (req) => {
      try {
        // Pobierz ustawienia z bazy danych
        const settings = await mongodbService.findDocument(dbName, "settings", {
          name: "systemSettings",
        });

        // Jeśli ustawienia nie istnieją, zwróć domyślne
        if (!settings || !settings.database) {
          return NextResponse.json({
            cleanupInterval: 30,
            backupEnabled: false,
          });
        }

        return NextResponse.json(settings.database);
      } catch (error) {
        console.error("Błąd podczas pobierania ustawień bazy danych:", error);
        return NextResponse.json(
          { message: "Wystąpił błąd podczas pobierania ustawień bazy danych" },
          { status: 500 }
        );
      }
    },
    ["admin"]
  );
}

// Aktualizuj ustawienia bazy danych
export async function POST(request: NextRequest) {
  return roleMiddleware(
    request as AuthenticatedRequest,
    updateDatabaseSettingsHandler,
    ["admin"]
  );
}
