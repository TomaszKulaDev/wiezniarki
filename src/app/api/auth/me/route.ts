import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "@/backend/middlewares/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { User } from "@/backend/models/User";

async function getUserHandler(request: AuthenticatedRequest) {
  try {
    if (!request.user) {
      return NextResponse.json(
        { message: "Użytkownik nie jest uwierzytelniony" },
        { status: 401 }
      );
    }

    // Pobierz pełne dane użytkownika
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      id: request.user.userId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Użytkownik nie został znaleziony" },
        { status: 404 }
      );
    }

    // Nie zwracaj hashu
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error: unknown) {
    console.error("Błąd pobierania danych użytkownika:", error);

    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania danych użytkownika" },
      { status: 500 }
    );
  }
}

export function GET(request: AuthenticatedRequest) {
  return authMiddleware(request, getUserHandler);
}
