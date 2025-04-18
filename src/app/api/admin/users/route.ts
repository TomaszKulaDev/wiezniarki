import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { User } from "@/backend/models/User";

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

    // Pobierz wszystkich użytkowników
    const users = await mongodbService.findDocuments<User>(dbName, "users");

    // Usuń wrażliwe dane
    const safeUsers = users.map((user) => {
      const {
        passwordHash,
        verificationCode,
        resetPasswordToken,
        ...safeUser
      } = user;
      return safeUser;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania użytkowników" },
      { status: 500 }
    );
  }
}
