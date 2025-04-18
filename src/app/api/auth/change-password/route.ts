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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Brakujące wymagane dane" },
        { status: 400 }
      );
    }

    // Walidacja nowego hasła
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Nowe hasło musi mieć co najmniej 8 znaków" },
        { status: 400 }
      );
    }

    // Zmień hasło
    const success = await authService.changePassword(
      payload.userId,
      currentPassword,
      newPassword
    );

    if (!success) {
      return NextResponse.json(
        { message: "Nie udało się zmienić hasła" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Hasło zostało pomyślnie zmienione" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd przy zmianie hasła:", error);

    // Obsługa konkretnych błędów
    if (error instanceof Error) {
      if (error.message === "Nieprawidłowe aktualne hasło") {
        return NextResponse.json(
          { message: "Nieprawidłowe aktualne hasło" },
          { status: 400 }
        );
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Wystąpił błąd przy zmianie hasła";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
