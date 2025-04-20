import { NextRequest, NextResponse } from "next/server";
import { mongodbService } from "@/backend/services/mongodbService";

const dbName = process.env.MONGODB_DB_NAME || "wiezniarki";

// Publiczny endpoint zwracający status trybu konserwacji
export async function GET(request: NextRequest) {
  try {
    // Pobierz ustawienia z bazy danych
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Jeśli ustawienia nie istnieją lub tryb konserwacji jest wyłączony
    if (!settings || !settings.maintenance || !settings.maintenance.enabled) {
      return NextResponse.json({
        enabled: false,
        message: "",
      });
    }

    // Zwróć tylko potrzebne informacje o trybie konserwacji
    return NextResponse.json({
      enabled: !!settings.maintenance.enabled,
      message:
        settings.maintenance.message ||
        "Trwają prace konserwacyjne. Prosimy spróbować później.",
    });
  } catch (error) {
    console.error("Błąd podczas pobierania statusu trybu konserwacji:", error);
    // Zwróć, że tryb konserwacji jest wyłączony w przypadku błędu
    return NextResponse.json({
      enabled: false,
      message: "",
    });
  }
}

// Funkcja do aktualizacji ustawień maintenance (dla wszystkich - można dodać zabezpieczenia później)
export async function POST(request: NextRequest) {
  try {
    const { enabled, message } = await request.json();

    console.log("Otrzymane dane:", { enabled, message });

    // Pobierz istniejące ustawienia
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    // Przygotuj obiekt z ustawieniami konserwacji
    const maintenanceSettings = {
      enabled: !!enabled,
      message: message || "Trwają prace konserwacyjne. Prosimy spróbować później.",
    };

    if (settings) {
      // Aktualizuj istniejące ustawienia
      await mongodbService.updateDocument(
        dbName,
        "settings",
        { name: "systemSettings" },
        {
          $set: {
            maintenance: maintenanceSettings,
            updatedAt: new Date(),
          }
        }
      );
    } else {
      // Utwórz nowe ustawienia
      await mongodbService.insertDocument(dbName, "settings", {
        name: "systemSettings",
        maintenance: maintenanceSettings,
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
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Ustawienia trybu konserwacji zostały zaktualizowane" 
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ustawień konserwacji:", error);
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd podczas aktualizacji ustawień" },
      { status: 500 }
    );
  }
}
