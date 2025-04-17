import { Profile } from "../models/Profile";
import { mongodbService } from "./mongodbService";
import { dbName } from "../utils/mongodb";

const COLLECTION_NAME = "profiles";

export const profileService = {
  // Pobierz wszystkie profile
  async getAllProfiles(): Promise<Profile[]> {
    return mongodbService.findDocuments<Profile>(dbName, COLLECTION_NAME);
  },

  // Pobierz profil po ID
  async getProfileById(id: string): Promise<Profile | null> {
    return mongodbService.findDocument<Profile>(dbName, COLLECTION_NAME, {
      id,
    });
  },

  // Utwórz nowy profil
  async createProfile(
    profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile> {
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await mongodbService.insertDocument(dbName, COLLECTION_NAME, newProfile);
    return newProfile;
  },

  // Aktualizuj profil
  async updateProfile(
    id: string,
    profileData: Partial<Profile>
  ): Promise<Profile | null> {
    await mongodbService.updateDocument(
      dbName,
      COLLECTION_NAME,
      { id },
      { ...profileData, updatedAt: new Date() }
    );

    return this.getProfileById(id);
  },

  // Usuń profil
  async deleteProfile(id: string): Promise<boolean> {
    try {
      const result = await mongodbService.deleteDocument(
        dbName,
        COLLECTION_NAME,
        { id }
      );

      return result !== null;
    } catch (error) {
      console.error(`Błąd podczas usuwania profilu ${id}:`, error);
      return false;
    }
  },

  // Wyszukaj profile według kryteriów
  async searchProfiles(criteria: {
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
  }): Promise<Profile[]> {
    const query: any = {};

    if (criteria.minAge || criteria.maxAge) {
      query.age = {};
      if (criteria.minAge) query.age.$gte = criteria.minAge;
      if (criteria.maxAge) query.age.$lte = criteria.maxAge;
    }

    if (criteria.facility) {
      query.facility = { $regex: criteria.facility, $options: "i" };
    }

    if (criteria.interests && criteria.interests.length > 0) {
      query.interests = { $in: criteria.interests };
    }

    return mongodbService.findDocuments<Profile>(
      dbName,
      COLLECTION_NAME,
      query
    );
  },

  // Pobierz profile z danego zakładu karnego
  async getProfilesByFacility(facility: string): Promise<Profile[]> {
    return mongodbService.findDocuments<Profile>(dbName, COLLECTION_NAME, {
      facility: { $regex: facility, $options: "i" },
    });
  },
};
