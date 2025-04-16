import { Profile } from "../models/Profile";
import { mongodbService } from "./mongodbService";

const DB_NAME = "wiezniarki";
const COLLECTION_NAME = "profiles";

export const profileService = {
  // Pobierz wszystkie profile
  async getAllProfiles(): Promise<Profile[]> {
    return mongodbService.findDocuments<Profile>(DB_NAME, COLLECTION_NAME);
  },

  // Pobierz profil po ID
  async getProfileById(id: string): Promise<Profile | null> {
    return mongodbService.findDocument<Profile>(DB_NAME, COLLECTION_NAME, {
      id,
    });
  },

  // Utwórz nowy profil
  async createProfile(profile: Profile): Promise<Profile> {
    await mongodbService.insertDocument(DB_NAME, COLLECTION_NAME, profile);
    return profile;
  },

  // Aktualizuj profil
  async updateProfile(
    id: string,
    profileData: Partial<Profile>
  ): Promise<Profile | null> {
    await mongodbService.updateDocument(
      DB_NAME,
      COLLECTION_NAME,
      { id },
      profileData
    );
    return this.getProfileById(id);
  },

  // Usuń profil
  async deleteProfile(id: string): Promise<boolean> {
    const result = await mongodbService.deleteDocument(
      DB_NAME,
      COLLECTION_NAME,
      { id }
    );
    return result.deletedCount === 1;
  },

  // Wyszukaj profile według kryteriów
  async searchProfiles(criteria: any): Promise<Profile[]> {
    const query: any = {};

    if (criteria.minAge || criteria.maxAge) {
      query.age = {};
      if (criteria.minAge) query.age.$gte = criteria.minAge;
      if (criteria.maxAge) query.age.$lte = criteria.maxAge;
    }

    if (criteria.facility) {
      query.facility = criteria.facility;
    }

    if (criteria.interests && criteria.interests.length > 0) {
      query.interests = { $in: criteria.interests };
    }

    return mongodbService.findDocuments<Profile>(
      DB_NAME,
      COLLECTION_NAME,
      query
    );
  },

  // Pobierz profile z danego zakładu karnego
  async getProfilesByFacility(facility: string): Promise<Profile[]> {
    return mongodbService.findDocuments<Profile>(DB_NAME, COLLECTION_NAME, {
      facility: { $regex: facility, $options: "i" },
    });
  },
};
