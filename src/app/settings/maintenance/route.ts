import { NextRequest, NextResponse } from "next/server";
import { mongodbService } from "@/backend/services/mongodbService";
import {
  roleMiddleware,
  AuthenticatedRequest,
} from "@/backend/middlewares/authMiddleware";

const dbName = process.env.MONGODB_DB_NAME || "wiezniarki";

// Publiczny endpoint zwracający status trybu konserwacji
export async function GET(request: NextRequest) {
  // istniejący kod...
}

// Funkcja do aktualizacji ustawień maintenance (tylko dla administratorów)
async function updateMaintenanceHandler(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    const { enabled, message } = await req.json();

    // Pobierz istniejące ustawienia
    const settings = await mongodbService.findDocument(dbName, "settings", {
      name: "systemSettings",
    });

    if (settings) {
      // Aktualizuj istniejące ustawienia
      await mongodbService.updateDocument(
        dbName,
        "settings",
        { name: "systemSettings" },
        {
          maintenance: {
            enabled: enabled,
            message:
              message ||
              "Trwają prace konserwacyjne. Prosimy spróbować później.",
          },
        }
      );
    } else {
      // Utwórz nowe ustawienia
      await mongodbService.insertDocument(dbName, "settings", {
        name: "systemSettings",
        maintenance: {
          enabled: enabled,
          message:
            message || "Trwają prace konserwacyjne. Prosimy spróbować później.",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ustawień konserwacji:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Wystąpił błąd podczas aktualizacji ustawień",
      },
      { status: 500 }
    );
  }
}

// Endpoint do aktualizacji ustawień konserwacji (tylko dla administratorów)
export function POST(request: NextRequest) {
  return roleMiddleware(
    request as AuthenticatedRequest,
    updateMaintenanceHandler,
    ["admin"]
  );
}
