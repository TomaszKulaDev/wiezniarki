import { NextRequest, NextResponse } from "next/server";
import { mongodbService } from "@/backend/services/mongodbService";

const dbName = process.env.MONGODB_DB_NAME || "wiezniarki";

// Pobranie statusu rejestracji - publiczny endpoint, nie wymaga autoryzacji
export async function GET(request: NextRequest) {
  try {
    // Pobierz ustawienia z bazy danych
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Jeśli ustawienia nie istnieją, zwróć domyślne
    if (!settings) {
      return NextResponse.json({
        enabled: true, // Domyślnie rejestracja jest włączona
      });
    }

    // Zwróć tylko to, co potrzebne dla front-endu
    return NextResponse.json({
      enabled: settings.registration?.enabled ?? true,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania ustawień rejestracji:", error);

    // W przypadku błędu, domyślnie pozwól na rejestrację
    return NextResponse.json({
      enabled: true,
    });
  }
}

// Aktualizacja statusu rejestracji - wymagana autoryzacja przez inny mechanizm
// W tym przykładzie pomijamy autoryzację, ale w produkcji trzeba ją dodać
export async function POST(request: NextRequest) {
  try {
    // W rzeczywistej aplikacji tutaj powinna być weryfikacja, czy użytkownik
    // jest administratorem - teraz pomijamy dla uproszczenia

    const body = await request.json();

    // Pobierz aktualne ustawienia
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Przygotuj dane do aktualizacji
    let updatedSettings;

    if (settings) {
      // Aktualizuj istniejące ustawienia
      updatedSettings = {
        ...settings,
        registration: {
          ...(settings.registration || {}),
          enabled: body.enabled,
        },
        updatedAt: new Date(),
      };

      await mongodbService.updateDocument(
        dbName,
        "settings",
        { name: "systemSettings" },
        updatedSettings
      );
    } else {
      // Utwórz nowe ustawienia
      updatedSettings = {
        name: "systemSettings",
        registration: {
          enabled: body.enabled,
          requireVerification: true,
        },
        maintenance: {
          enabled: false,
          message: "Trwają prace konserwacyjne. Prosimy spróbować później.",
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

      await mongodbService.insertDocument(dbName, "settings", updatedSettings);
    }

    return NextResponse.json({
      success: true,
      message: "Ustawienia rejestracji zostały zaktualizowane",
      enabled: body.enabled,
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ustawień rejestracji:", error);
    return NextResponse.json(
      {
        message: "Wystąpił błąd podczas aktualizacji ustawień rejestracji",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
