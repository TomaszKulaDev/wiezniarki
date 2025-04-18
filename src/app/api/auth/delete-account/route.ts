import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";
import { jwtService } from "@/backend/services/jwtService";

export async function POST(request: NextRequest) {
  try {
    // Pobierz token dostępu z ciasteczka
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Wymagane uwierzytelnienie" },
        { status: 401 }
      );
    }

    // Weryfikuj token
    const payload = jwtService.verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json(
        { message: "Nieważny token dostępu" },
        { status: 401 }
      );
    }

    // Pobierz dane z ciała żądania
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Hasło jest wymagane do potwierdzenia" },
        { status: 400 }
      );
    }

    // Usuń konto
    await authService.deleteAccount(payload.userId, password);

    // Wyczyść ciasteczka uwierzytelniające
    const response = NextResponse.json(
      { message: "Konto zostało pomyślnie usunięte" },
      { status: 200 }
    );

    // Wyczyść cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Błąd przy usuwaniu konta:", error);

    // Obsługa konkretnych błędów
    if (error instanceof Error) {
      if (error.message === "Nieprawidłowe hasło") {
        return NextResponse.json(
          { message: "Nieprawidłowe hasło" },
          { status: 400 }
        );
      } else if (error.message === "Użytkownik nie istnieje") {
        return NextResponse.json(
          { message: "Nieprawidłowy użytkownik" },
          { status: 404 }
        );
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Wystąpił błąd przy usuwaniu konta";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
