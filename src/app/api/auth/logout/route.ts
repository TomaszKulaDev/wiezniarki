import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    // Pobierz refreshToken z ciasteczka
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Utwórz odpowiedź z sukcesem
    const response = NextResponse.json(
      { success: true, message: "Wylogowano pomyślnie" },
      { status: 200 }
    );

    // Usuń ciasteczka
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Błąd wylogowania:", error);

    // Nawet w przypadku błędu, usuń ciasteczka
    const response = NextResponse.json(
      { success: false, message: "Wystąpił problem podczas wylogowania" },
      { status: 500 }
    );

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }
}
