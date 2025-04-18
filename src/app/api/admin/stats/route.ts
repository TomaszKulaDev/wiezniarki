import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";

export async function GET(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    // Pobieramy kolekcje
    const usersCollection = await mongodbService.getCollection(dbName, "users");
    const profilesCollection = await mongodbService.getCollection(
      dbName,
      "profiles"
    );
    const tokensCollection = await mongodbService.getCollection(
      dbName,
      "tokens"
    );
    const messagesCollection = await mongodbService.getCollection(
      dbName,
      "messages"
    );

    // Obliczamy statystyki użytkowników
    const totalUsers = await usersCollection.countDocuments();
    const activeUsers = await usersCollection.countDocuments({ active: true });
    const prisonerUsers = await usersCollection.countDocuments({
      role: "prisoner",
    });
    const partnerUsers = await usersCollection.countDocuments({
      role: "partner",
    });
    const adminUsers = await usersCollection.countDocuments({ role: "admin" });
    const moderatorUsers = await usersCollection.countDocuments({
      role: "moderator",
    });

    // Data 7 dni wstecz
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Nowi użytkownicy w ostatnim tygodniu
    const newUsers = await usersCollection.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Statystyki profili
    const totalProfiles = await profilesCollection.countDocuments();
    const prisonerProfiles = await profilesCollection.countDocuments({
      // Założenie: pole określające typ profilu
      user: {
        $in: await usersCollection
          .find({ role: "prisoner" })
          .toArray()
          .then((users) => users.map((u) => u.id)),
      },
    });
    const partnerProfiles = await profilesCollection.countDocuments({
      // Założenie: pole określające typ profilu
      user: {
        $in: await usersCollection
          .find({ role: "partner" })
          .toArray()
          .then((users) => users.map((u) => u.id)),
      },
    });
    const newProfiles = await profilesCollection.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Aktywność
    const recentLogins = await usersCollection.countDocuments({
      lastLogin: { $gte: weekAgo },
    });
    const recentRegistrations = await usersCollection.countDocuments({
      createdAt: { $gte: weekAgo },
    });
    const recentProfilesCreated = await profilesCollection.countDocuments({
      createdAt: { $gte: weekAgo },
    });
    const recentMessages = await messagesCollection.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Zwróć skompilowane statystyki
    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        prisoner: prisonerUsers,
        partner: partnerUsers,
        admin: adminUsers,
        moderator: moderatorUsers,
        newLastWeek: newUsers,
      },
      profiles: {
        total: totalProfiles,
        active: totalProfiles, // Zakładamy, że wszystkie profile są aktywne
        prisoner: prisonerProfiles,
        partner: partnerProfiles,
        newLastWeek: newProfiles,
      },
      activity: {
        logins: recentLogins,
        registrations: recentRegistrations,
        profilesCreated: recentProfilesCreated,
        messages: recentMessages,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania statystyk:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania statystyk" },
      { status: 500 }
    );
  }
}
