import { NextRequest } from "next/server";
import { jwtService } from "../services/jwtService";
import { mongodbService } from "../services/mongodbService";
import { dbName } from "../utils/mongodb";
import { User } from "../models/User";

export async function authMiddleware(
  request: NextRequest, 
  allowedRoles: User["role"][] = []
): Promise<{ 
  success: boolean; 
  userId?: string; 
  status?: number; 
  message?: string;
}> {
  try {
    // Pobierz token dostępu z ciasteczka
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return { 
        success: false, 
        status: 401, 
        message: "Wymagane uwierzytelnienie" 
      };
    }

    // Weryfikuj token
    const payload = jwtService.verifyAccessToken(accessToken);
    if (!payload) {
      return { 
        success: false, 
        status: 401, 
        message: "Nieważny token dostępu" 
      };
    }

    // Jeśli określono role, sprawdź czy użytkownik ma wymaganą rolę
    if (allowedRoles.length > 0) {
      // Pobierz użytkownika, aby zweryfikować jego rolę
      const user = await mongodbService.findDocument<User>(
        dbName,
        "users",
        { id: payload.userId }
      );

      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: "Użytkownik nie istnieje" 
        };
      }

      if (!allowedRoles.includes(user.role)) {
        return { 
          success: false, 
          status: 403, 
          message: "Brak uprawnień do tej operacji" 
        };
      }
    }

    return { 
      success: true, 
      userId: payload.userId 
    };
  } catch (error) {
    console.error("Błąd w middleware uwierzytelniania:", error);
    return { 
      success: false, 
      status: 500, 
      message: "Wystąpił wewnętrzny błąd serwera" 
    };
  }
} 