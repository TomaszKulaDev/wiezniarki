import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Profile } from "@/backend/models/Profile";

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

    // Pobierz wszystkie profile
    const profiles = await mongodbService.findDocuments<Profile>(
      dbName,
      "profiles"
    );

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Błąd podczas pobierania profili:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania profili" },
      { status: 500 }
    );
  }
}
