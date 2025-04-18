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

// Zdefiniuj typ dla rezultatu czyszczenia tokenów
interface CleanupResult {
  expiredRemoved: number;
  revokedRemoved: number;
  oldRemoved: number;
  totalRemoved: number;
  debug?: {
    operations: string[];
    queries: any[];
  };
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
  async revokeAllUserTokens(userId: string): Promise<boolean> {
    try {
      // Oznacz wszystkie tokeny użytkownika jako unieważnione
      await mongodbService.updateDocument(
        dbName,
        COLLECTION_NAME,
        { userId },
        { isRevoked: true, updatedAt: new Date() }
      );

      return true;
    } catch (error) {
      console.error("Błąd podczas unieważniania wszystkich tokenów:", error);
      throw error;
    }
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

  // Funkcja czyszcząca wygasłe i unieważnione tokeny
  async cleanupTokens(
    options: {
      removeExpired?: boolean;
      removeRevoked?: boolean;
      olderThan?: number; // w dniach
      dryRun?: boolean; // tryb testowy, tylko zwraca liczbę tokenów do usunięcia
      ignoreExpiry?: boolean; // nowa opcja - ignoruje datę wygaśnięcia i usuwa wszystkie tokeny
    } = {}
  ): Promise<CleanupResult> {
    const result = {
      expiredRemoved: 0,
      revokedRemoved: 0,
      oldRemoved: 0,
      totalRemoved: 0,
      debug: {
        operations: [] as string[],
        queries: [] as any[],
      },
    };

    try {
      const collection = await mongodbService.getCollection(
        dbName,
        COLLECTION_NAME
      );

      // 1. Usuń wygasłe tokeny jeśli opcja jest włączona
      if (options.removeExpired) {
        // Jeśli ignoreExpiry jest true, to usuwamy wszystkie tokeny niezależnie od daty wygaśnięcia
        const expiredQuery = options.ignoreExpiry
          ? {} // Puste zapytanie = wszystkie tokeny
          : { expires: { $lt: new Date() } };

        result.debug.queries.push({ type: "expired", query: expiredQuery });

        const expiredTokens = await collection.find(expiredQuery).toArray();
        result.expiredRemoved = expiredTokens.length;

        if (!options.dryRun && expiredTokens.length > 0) {
          const deleteResult = await collection.deleteMany(expiredQuery);
          result.debug.operations.push(
            `Usunięto ${deleteResult.deletedCount} ${
              options.ignoreExpiry ? "wszystkich" : "wygasłych"
            } tokenów`
          );

          // Weryfikacja czy faktycznie usunięto tokeny
          const remainingTokens = await collection.find(expiredQuery).toArray();
          result.debug.operations.push(
            `Pozostało ${remainingTokens.length} ${
              options.ignoreExpiry ? "" : "wygasłych"
            } tokenów`
          );
        } else {
          result.debug.operations.push(
            `Tryb testowy: znaleziono ${expiredTokens.length} ${
              options.ignoreExpiry ? "wszystkich" : "wygasłych"
            } tokenów`
          );
        }
      }

      // 2. Usuń unieważnione tokeny jeśli opcja jest włączona
      if (options.removeRevoked) {
        const revokedQuery = { isRevoked: true };
        result.debug.queries.push({ type: "revoked", query: revokedQuery });

        const revokedTokens = await collection.find(revokedQuery).toArray();
        result.revokedRemoved = revokedTokens.length;

        if (!options.dryRun && revokedTokens.length > 0) {
          const deleteResult = await collection.deleteMany(revokedQuery);
          result.debug.operations.push(
            `Usunięto ${deleteResult.deletedCount} unieważnionych tokenów`
          );

          // Weryfikacja czy faktycznie usunięto tokeny
          const remainingTokens = await collection.find(revokedQuery).toArray();
          result.debug.operations.push(
            `Pozostało ${remainingTokens.length} unieważnionych tokenów`
          );
        } else {
          result.debug.operations.push(
            `Tryb testowy: znaleziono ${revokedTokens.length} unieważnionych tokenów`
          );
        }
      }

      // 3. Usuń stare tokeny na podstawie daty utworzenia
      if (options.olderThan && options.olderThan > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - options.olderThan);

        const oldQuery = { createdAt: { $lt: cutoffDate } };
        result.debug.queries.push({
          type: "old",
          query: oldQuery,
          cutoffDate: cutoffDate.toISOString(),
        });

        const oldTokens = await collection.find(oldQuery).toArray();
        result.oldRemoved = oldTokens.length;

        if (!options.dryRun && oldTokens.length > 0) {
          const deleteResult = await collection.deleteMany(oldQuery);
          result.debug.operations.push(
            `Usunięto ${deleteResult.deletedCount} starych tokenów`
          );

          // Weryfikacja czy faktycznie usunięto tokeny
          const remainingTokens = await collection.find(oldQuery).toArray();
          result.debug.operations.push(
            `Pozostało ${remainingTokens.length} starych tokenów`
          );
        } else {
          result.debug.operations.push(
            `Tryb testowy: znaleziono ${oldTokens.length} starych tokenów`
          );
        }
      }

      // Oblicz całkowitą liczbę usunięć
      result.totalRemoved =
        result.expiredRemoved + result.revokedRemoved + result.oldRemoved;

      return result;
    } catch (error: unknown) {
      console.error("Błąd podczas czyszczenia tokenów:", error);

      // Dodaj informację o błędzie do debugowania w bezpieczny sposób
      if (error instanceof Error) {
        result.debug.operations.push(`BŁĄD: ${error.message}`);
      } else {
        result.debug.operations.push(`BŁĄD: Nieznany błąd`);
      }

      throw error;
    }
  },
};
