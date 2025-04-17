import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { User } from "../models/User";
import { mongodbService } from "./mongodbService";
import { dbName } from "../utils/mongodb";

const COLLECTION_NAME = "tokens";

interface TokenPayload {
  userId: string;
  email: string;
  role: User["role"];
}

interface RefreshTokenDoc {
  userId: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
  family: string; // Dla wykrywania kradzieży tokenów
  isRevoked: boolean;
}

export const jwtService = {
  // Generowanie tokenu dostępu (krótko żyjącego)
  generateAccessToken(user: Pick<User, "id" | "email" | "role">): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, Buffer.from(jwtConfig.accessToken.secret), {
      expiresIn: jwtConfig.accessToken.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.SignOptions);
  },

  // Generowanie tokenu odświeżającego (długo żyjącego)
  async generateRefreshToken(
    user: Pick<User, "id" | "email" | "role">,
    family?: string
  ): Promise<string> {
    // Losowy token z dodatkową entropią
    const tokenFamily = family || Math.random().toString(36).substring(2);

    const refreshToken = jwt.sign(
      { userId: user.id, family: tokenFamily },
      Buffer.from(jwtConfig.refreshToken.secret),
      {
        expiresIn: jwtConfig.refreshToken.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as jwt.SignOptions
    );

    // Zapisz token odświeżający w bazie danych
    const expiryDate = new Date();
    // Parsuj expiresIn do liczby dni (zakładając format '7d')
    const days = parseInt(jwtConfig.refreshToken.expiresIn);
    expiryDate.setDate(expiryDate.getDate() + (isNaN(days) ? 7 : days));

    // Zapisz w bazie danych
    await mongodbService.insertDocument<RefreshTokenDoc>(
      dbName,
      COLLECTION_NAME,
      {
        userId: user.id,
        token: refreshToken,
        family: tokenFamily,
        expires: expiryDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        isRevoked: false,
      }
    );

    return refreshToken;
  },

  // Weryfikacja tokenu dostępu
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        Buffer.from(jwtConfig.accessToken.secret),
        {
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        }
      ) as TokenPayload;

      return decoded;
    } catch (error) {
      console.error("Błąd weryfikacji tokenu dostępu:", error);
      return null;
    }
  },

  // Weryfikacja tokenu odświeżającego
  async verifyRefreshToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    family?: string;
  }> {
    try {
      // Weryfikuj token
      const decoded = jwt.verify(
        token,
        Buffer.from(jwtConfig.refreshToken.secret),
        {
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        }
      ) as { userId: string; family: string };

      // Sprawdź, czy token jest w bazie danych i nie jest unieważniony
      const storedToken = await mongodbService.findDocument<RefreshTokenDoc>(
        dbName,
        COLLECTION_NAME,
        { token, isRevoked: false }
      );

      if (!storedToken) {
        return { valid: false };
      }

      // Sprawdź, czy token nie wygasł
      if (storedToken.expires < new Date()) {
        return { valid: false };
      }

      return {
        valid: true,
        userId: decoded.userId,
        family: decoded.family,
      };
    } catch (error) {
      console.error("Błąd weryfikacji tokenu odświeżającego:", error);
      return { valid: false };
    }
  },

  // Unieważnij wszystkie tokeny odświeżające dla użytkownika
  async revokeAllUserTokens(userId: string): Promise<void> {
    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { userId },
      { isRevoked: true, updatedAt: new Date() }
    );
  },

  // Unieważnij pojedynczy token odświeżający
  async revokeRefreshToken(token: string): Promise<void> {
    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { token },
      { isRevoked: true, updatedAt: new Date() }
    );
  },

  // Unieważnij wszystkie tokeny z tej samej rodziny (w przypadku kradzieży)
  async revokeTokenFamily(family: string): Promise<void> {
    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { family },
      { isRevoked: true, updatedAt: new Date() }
    );
  },

  // Rotacja tokenów - unieważnij stary i wygeneruj nowy token odświeżający
  async rotateRefreshToken(
    oldToken: string,
    user: Pick<User, "id" | "email" | "role">
  ): Promise<string | null> {
    try {
      const { valid, family } = await this.verifyRefreshToken(oldToken);

      if (!valid || !family) {
        return null;
      }

      // Unieważnij stary token
      await this.revokeRefreshToken(oldToken);

      // Generuj nowy token z tą samą rodziną
      return await this.generateRefreshToken(user, family);
    } catch (error) {
      console.error("Błąd podczas rotacji tokenu:", error);
      return null;
    }
  },

  // Usuwanie wygasłych tokenów (do uruchomienia w zadaniu cron)
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();

    await mongodbService.deleteDocument(dbName, COLLECTION_NAME, {
      expires: { $lt: now },
    });
  },
};
