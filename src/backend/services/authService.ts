import { User } from "../models/User";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const users: User[] = [];

export const authService = {
  // Rejestracja użytkownika
  async register(
    email: string,
    password: string,
    role: User["role"]
  ): Promise<Omit<User, "passwordHash">> {
    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      throw new Error("Użytkownik z tym adresem email już istnieje");
    }

    // W rzeczywistym projekcie zahaszowalibyśmy hasło
    const passwordHash = `hashed_${password}`;

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
      verified: false,
      verificationCode,
      active: true,
      loginAttempts: 0,
      locked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Logowanie użytkownika
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "passwordHash"> }> {
    const user = users.find((user) => user.email === email);

    if (!user) {
      throw new Error("Nieprawidłowy email lub hasło");
    }

    if (user.locked) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new Error(
          `Konto zablokowane. Spróbuj ponownie po ${user.lockedUntil.toLocaleString()}`
        );
      } else {
        user.locked = false;
        user.loginAttempts = 0;
      }
    }

    // W rzeczywistym projekcie porównalibyśmy zahaszowane hasła
    if (user.passwordHash !== `hashed_${password}`) {
      user.loginAttempts += 1;

      // Zablokuj konto po 5 nieudanych próbach
      if (user.loginAttempts >= 5) {
        user.locked = true;
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minut
        throw new Error(
          "Konto zablokowane na 30 minut z powodu zbyt wielu nieudanych prób logowania"
        );
      }

      throw new Error("Nieprawidłowy email lub hasło");
    }

    if (!user.verified) {
      throw new Error(
        "Konto nie zostało zweryfikowane. Sprawdź swoją skrzynkę email"
      );
    }

    // Resetuj licznik nieudanych prób
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    // W rzeczywistym projekcie wygenerowalibyśmy token JWT
    const token = `fake_jwt_token_${user.id}`;

    // Nie zwracamy hashu w odpowiedzi
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  // Weryfikacja użytkownika
  async verifyAccount(email: string, code: string): Promise<boolean> {
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      throw new Error("Użytkownik nie istnieje");
    }

    if (users[userIndex].verified) {
      return true; // Konto już zweryfikowane
    }

    if (users[userIndex].verificationCode !== code) {
      throw new Error("Nieprawidłowy kod weryfikacyjny");
    }

    users[userIndex].verified = true;
    users[userIndex].verificationCode = undefined;
    users[userIndex].updatedAt = new Date();

    return true;
  },

  // Resetowanie hasła - żądanie
  async requestPasswordReset(email: string): Promise<boolean> {
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      // Nie ujawniaj czy użytkownik istnieje
      return true;
    }

    // Generowanie tokenu resetowania hasła
    const resetToken = Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 godzina

    users[userIndex].resetPasswordToken = resetToken;
    users[userIndex].resetPasswordExpires = expires;
    users[userIndex].updatedAt = new Date();

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
    const userIndex = users.findIndex(
      (user) =>
        user.email === email &&
        user.resetPasswordToken === token &&
        user.resetPasswordExpires &&
        user.resetPasswordExpires > new Date()
    );

    if (userIndex === -1) {
      throw new Error("Nieprawidłowy lub wygasły token resetowania hasła");
    }

    // W rzeczywistym projekcie zahaszowalibyśmy nowe hasło
    users[userIndex].passwordHash = `hashed_${newPassword}`;
    users[userIndex].resetPasswordToken = undefined;
    users[userIndex].resetPasswordExpires = undefined;
    users[userIndex].updatedAt = new Date();

    return true;
  },
};
