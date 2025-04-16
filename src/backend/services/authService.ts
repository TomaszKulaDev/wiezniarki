import { User } from "../models/User";
import { mongodbService } from "./mongodbService";
import { dbName } from "../utils/mongodb";
import * as crypto from "crypto";

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

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Logowanie użytkownika
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "passwordHash"> }> {
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

    // W rzeczywistym projekcie wygenerowalibyśmy token JWT
    // Dla testów generujemy prosty token
    const token = `${user.id}_${Date.now()}_${crypto
      .randomBytes(16)
      .toString("hex")}`;

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
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

  // Resetowanie hasła - żądanie
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

    // W rzeczywistym projekcie wysłalibyśmy email z tokenem
    console.log(`Token resetowania dla ${email}: ${resetToken}`);

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
};
