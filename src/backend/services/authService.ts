import { User } from "../models/User";
import { mongodbService } from "./mongodbService";
import { dbName } from "../utils/mongodb";
import * as crypto from "crypto";
import { emailService } from "./emailService";
import { jwtService } from "./jwtService";

const COLLECTION_NAME = "users";

export const authService = {
  // Rejestracja użytkownika
  async register(
    email: string,
    password: string,
    role: User["role"]
  ): Promise<Omit<User, "passwordHash">> {
    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { email }
    );

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Haszowanie hasła
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    const passwordHash = `${salt}:${hash}`;

    // Generowanie kodu weryfikacyjnego
    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const newUser: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      role,
      verified: process.env.NODE_ENV === "development", // W dev automatycznie weryfikujemy
      verificationCode,
      active: true,
      loginAttempts: 0,
      locked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Zapisanie użytkownika w bazie danych
    await mongodbService.insertDocument(dbName, COLLECTION_NAME, newUser);

    // Wysłanie emaila weryfikacyjnego (tylko w produkcji)
    if (process.env.NODE_ENV !== "development") {
      await emailService.sendVerificationEmail(email, verificationCode);
    } else {
      // W środowisku deweloperskim wyświetlamy kod weryfikacyjny w konsoli
      console.log(`Kod weryfikacyjny dla ${email}: ${verificationCode}`);
    }

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Logowanie użytkownika
  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "passwordHash">;
  }> {
    // Pobranie użytkownika z bazy danych
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { email }
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.locked) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new Error("Account is locked");
      } else {
        // Odblokowanie konta, jeśli czas blokady minął
        await mongodbService.updateDocument(
          dbName,
          COLLECTION_NAME,
          { id: user.id },
          { locked: false, loginAttempts: 0, updatedAt: new Date() }
        );
        user.locked = false;
        user.loginAttempts = 0;
      }
    }

    // Weryfikacja hasła
    const [salt, storedHash] = user.passwordHash.split(":");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (storedHash !== hash) {
      // Inkrementacja liczby nieudanych prób logowania
      const loginAttempts = user.loginAttempts + 1;
      const updates: Partial<User> = {
        loginAttempts,
        updatedAt: new Date(),
      };

      // Zablokuj konto po 5 nieudanych próbach
      if (loginAttempts >= 5) {
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minut
        updates.locked = true;
        updates.lockedUntil = lockedUntil;

        await mongodbService.updateDocument(
          dbName,
          COLLECTION_NAME,
          { id: user.id },
          updates
        );

        throw new Error("Account is locked");
      }

      await mongodbService.updateDocument(
        dbName,
        COLLECTION_NAME,
        { id: user.id },
        updates
      );

      throw new Error("Invalid credentials");
    }

    // W środowisku produkcyjnym sprawdź weryfikację
    if (!user.verified && process.env.NODE_ENV !== "development") {
      throw new Error("Account is not verified");
    }

    // Aktualizacja danych logowania
    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { id: user.id },
      {
        loginAttempts: 0,
        lastLogin: new Date(),
        updatedAt: new Date(),
      }
    );

    // Wygeneruj tokeny JWT
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { accessToken, refreshToken, user: userWithoutPassword };
  },

  // Weryfikacja użytkownika
  async verifyAccount(email: string, code: string): Promise<boolean> {
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { email }
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.verified) {
      return true; // Konto już zweryfikowane
    }

    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { id: user.id },
      {
        verified: true,
        verificationCode: undefined,
        updatedAt: new Date(),
      }
    );

    return true;
  },

  // Resetowanie hasła - żądanie (zaktualizowana)
  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { email }
    );

    if (!user) {
      // Nie ujawniaj czy użytkownik istnieje
      return true;
    }

    // Generowanie tokenu resetowania hasła
    const resetToken = Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 godzina

    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { id: user.id },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires,
        updatedAt: new Date(),
      }
    );

    // Wysłanie emaila z tokenem do resetowania hasła
    if (process.env.NODE_ENV !== "development") {
      await emailService.sendPasswordResetEmail(email, resetToken);
    } else {
      // W środowisku deweloperskim wyświetlamy token w konsoli
      console.log(`Token resetowania dla ${email}: ${resetToken}`);
    }

    return true;
  },

  // Resetowanie hasła - potwierdzenie
  async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      {
        email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      }
    );

    if (!user) {
      throw new Error("Nieprawidłowy lub wygasły token resetowania hasła");
    }

    // Haszowanie nowego hasła
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(newPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    const passwordHash = `${salt}:${hash}`;

    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { id: user.id },
      {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      }
    );

    return true;
  },

  // Nowa metoda do odświeżania tokenu
  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const result = await jwtService.verifyRefreshToken(refreshToken);

    if (!result.valid || !result.userId) {
      return null;
    }

    // Pobierz dane użytkownika
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { id: result.userId }
    );

    if (!user) {
      return null;
    }

    // Wygeneruj nowy token dostępu
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Rotacja tokenu odświeżającego (dla bezpieczeństwa)
    const newRefreshToken = await jwtService.rotateRefreshToken(refreshToken, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    if (!newRefreshToken) {
      return null;
    }

    return { accessToken, refreshToken: newRefreshToken };
  },

  // Wylogowanie (unieważnienie tokenów)
  async logout(refreshToken: string): Promise<boolean> {
    try {
      // Unieważnij token odświeżający
      await jwtService.revokeRefreshToken(refreshToken);
      return true;
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
      return false;
    }
  },
};
