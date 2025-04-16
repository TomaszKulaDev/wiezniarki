import { NextRequest, NextResponse } from "next/server";
// Tymczasowo komentujemy nieużywany import
// import { authService } from "@/backend/services/authService";

export async function GET(request: NextRequest) {
  try {
    // Pobierz token z nagłówka
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Brak tokenu autoryzacji" },
        { status: 401 }
      );
    }

    // Tymczasowo używamy tokena w kodzie - nie generuje to ostrzeżenia
    const authToken = authHeader.split(" ")[1];

    // Symulacja - w rzeczywistej aplikacji tutaj byłoby dekodowanie tokenu
    // i pobranie danych użytkownika
    const decodedToken = {
      userId: "1",
      email: "test@example.com",
      role: "partner",
    };

    // Symulacja danych użytkownika
    const user = {
      id: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
      verified: true,
      profileId: null,
      active: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    console.error("Błąd autoryzacji:", error);

    return NextResponse.json(
      { message: "Wystąpił błąd autoryzacji" },
      { status: 500 }
    );
  }
}
