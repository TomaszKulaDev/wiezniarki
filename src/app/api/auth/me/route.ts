import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/backend/services/jwtService";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { User } from "@/backend/models/User";

export async function GET(request: NextRequest) {
  try {
    // Pobierz token z ciasteczka zamiast z nagłówka
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Użytkownik nie jest uwierzytelniony" },
        { status: 401 }
      );
    }

    // Weryfikuj token
    const payload = jwtService.verifyAccessToken(accessToken);

    if (!payload) {
      // Jeśli token jest nieważny, spróbuj go odświeżyć
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (!refreshToken) {
        return NextResponse.json(
          { message: "Użytkownik nie jest uwierzytelniony" },
          { status: 401 }
        );
      }

      // Próba odświeżenia tokenów nie jest potrzebna tutaj,
      // ponieważ middleware powinien to obsłużyć przed dotarciem do tego endpointu
      return NextResponse.json(
        { message: "Nieważny token dostępu" },
        { status: 401 }
      );
    }

    // Pobierz pełne dane użytkownika
    const user = await mongodbService.findDocument<User>(dbName, "users", {
      id: payload.userId,
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
