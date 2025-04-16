import * as dotenv from "dotenv";
// Ładujemy zmienne środowiskowe z .env.local
dotenv.config({ path: ".env.local" });

import { authService } from "../backend/services/authService";
import { mongodbService } from "../backend/services/mongodbService";
import { dbName } from "../backend/utils/mongodb";

async function testAuth() {
  console.log("🧪 Rozpoczynam test systemu autoryzacji");

  try {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "Test123!";

    // 1. Test rejestracji
    console.log(`\n📝 Rejestracja użytkownika z email: ${testEmail}`);
    const newUser = await authService.register(
      testEmail,
      testPassword,
      "partner"
    );
    console.log("✅ Użytkownik zarejestrowany:", {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified,
    });

    // 2. Test logowania
    console.log("\n🔑 Próba logowania");
    const loginResult = await authService.login(testEmail, testPassword);
    console.log("✅ Użytkownik zalogowany:", {
      id: loginResult.user.id,
      email: loginResult.user.email,
      role: loginResult.user.role,
    });
    console.log("🔒 Token:", loginResult.token);

    // 3. Sprawdzenie czy dane są w bazie
    console.log("\n🔍 Sprawdzanie bazy danych");
    const usersCollection = await mongodbService.getCollection(dbName, "users");
    const count = await usersCollection.countDocuments();
    console.log(`📊 Liczba użytkowników w bazie: ${count}`);

    // 4. Próba logowania z błędnym hasłem
    console.log("\n❌ Próba logowania z błędnym hasłem");
    try {
      await authService.login(testEmail, "WrongPassword123!");
      console.log("❌ Test nie powiódł się - zalogowano z błędnym hasłem!");
    } catch (error) {
      console.log("✅ Poprawnie odrzucono nieprawidłowe dane logowania");
    }

    // 5. Wyświetlenie wszystkich użytkowników
    console.log("\n📋 Lista użytkowników w bazie:");
    const users = await mongodbService.findDocuments(dbName, "users");
    users.forEach((user, index) => {
      console.log(`\n--- Użytkownik ${index + 1} ---`);
      // Nie pokazujemy hasła
      const { passwordHash, ...safeUser } = user;
      console.log(safeUser);
    });
  } catch (error) {
    console.error("❌ Błąd podczas testu:", error);
  } finally {
    console.log("\n✅ Test zakończony");
    process.exit(0);
  }
}

// Uruchom test
testAuth();
