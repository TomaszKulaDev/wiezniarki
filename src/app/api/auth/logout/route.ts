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

    // Usuń ciasteczka - poprzez ustawienie wygasłych wartości
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Natychmiastowe wygaśnięcie
      path: "/",
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Natychmiastowe wygaśnięcie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Błąd wylogowania:", error);

    // Nawet w przypadku błędu, usuń ciasteczka
    const response = NextResponse.json(
      { success: false, message: "Wystąpił problem podczas wylogowania" },
      { status: 500 }
    );

    // Usuń ciasteczka - poprzez ustawienie wygasłych wartości
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Natychmiastowe wygaśnięcie
      path: "/",
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Natychmiastowe wygaśnięcie
      path: "/",
    });

    return response;
  }
}
