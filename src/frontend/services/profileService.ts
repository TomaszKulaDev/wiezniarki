import { Profile } from "../../backend/models/Profile";

const API_URL = "/api/profiles";

export const profileService = {
  // Get all profiles
  async getProfiles(): Promise<Profile[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Błąd pobierania profilów");
      }
      return await response.json();
    } catch (error) {
      console.error("Błąd podczas pobierania profilów:", error);
      throw error;
    }
  },

  // Get a single profile by ID
  async getProfileById(id: string): Promise<Profile> {
    try {
      const response = await fetch(`${API_URL}?id=${id}`);
      if (!response.ok) {
        throw new Error("Profil nie został znaleziony");
      }
      return await response.json();
    } catch (error) {
      console.error(`Błąd podczas pobierania profilu o ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new profile
  async createProfile(
    profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas tworzenia profilu");
      }

      return await response.json();
    } catch (error) {
      console.error("Błąd podczas tworzenia profilu:", error);
      throw error;
    }
  },

  // Update an existing profile
  async updateProfile(
    id: string,
    profileData: Partial<Profile>
  ): Promise<Profile> {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...profileData, id }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas aktualizacji profilu");
      }

      return await response.json();
    } catch (error) {
      console.error(`Błąd podczas aktualizacji profilu o ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a profile
  async deleteProfile(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania profilu");
      }
    } catch (error) {
      console.error(`Błąd podczas usuwania profilu o ID ${id}:`, error);
      throw error;
    }
  },
};
