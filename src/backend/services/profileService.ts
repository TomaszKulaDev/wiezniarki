import { Profile } from "../models/Profile";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const profiles: Profile[] = [
  {
    id: "1",
    firstName: "Anna",
    lastName: "K.",
    age: 32,
    facility: "Zakład Karny w Warszawie",
    interests: ["malarstwo", "literatura", "joga"],
    skills: ["pisanie", "rysowanie", "szycie"],
    bio: "Pasjonatka sztuki i literatury. Uczy się malarstwa i projektowania graficznego.",
    education: "Liceum ogólnokształcące",
    goals:
      "Po wyjściu chciałabym pracować w galerii sztuki lub jako ilustratorka.",
    contactPreferences: {
      email: true,
      letter: true,
      phone: false,
    },
    relationshipStatus: "single",
    personalityTraits: ["kreatywna", "spokojna", "refleksyjna"],
    hobbies: ["czytanie", "malowanie", "pisanie opowiadań"],
    matchingPreferences: {
      minAge: 30,
      maxAge: 45,
      interests: ["sztuka", "literatura", "podróże"],
      lookingFor: "relationship",
      locationPreference: ["Warszawa", "Łódź"],
    },
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-03-20"),
    releaseDateEstimate: new Date("2025-06-10"),
  },
  {
    id: "2",
    firstName: "Martyna",
    lastName: "W.",
    age: 28,
    facility: "Zakład Karny w Krakowie",
    interests: ["muzyka", "taniec", "pisanie"],
    skills: ["gra na gitarze", "śpiew", "komponowanie"],
    bio: "Samouk gry na gitarze i pianinie. Pisze opowiadania i teksty piosenek.",
    education: "Studia licencjackie z filologii polskiej",
    goals: "Marzy o prowadzeniu warsztatów muzycznych dla młodzieży.",
    contactPreferences: {
      email: true,
      letter: true,
      phone: true,
    },
    relationshipStatus: "complicated",
    personalityTraits: ["artystyczna", "wrażliwa", "otwarta"],
    hobbies: ["komponowanie muzyki", "śpiewanie", "pisanie tekstów"],
    matchingPreferences: {
      minAge: 27,
      maxAge: 40,
      interests: ["muzyka", "sztuka", "edukacja"],
      lookingFor: "friendship",
      locationPreference: ["Kraków", "Wrocław"],
    },
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-04-15"),
    releaseDateEstimate: new Date("2024-11-30"),
  },
  {
    id: "3",
    firstName: "Karolina",
    lastName: "M.",
    age: 35,
    facility: "Zakład Karny w Poznaniu",
    interests: ["psychologia", "rozwój osobisty", "gotowanie"],
    skills: ["coaching", "mediacja", "gotowanie"],
    bio: "Interesuje się psychologią i rozwojem osobistym. Wierzy w drugą szansę dla każdego.",
    education: "Studia magisterskie z psychologii",
    goals: "Chciałabym prowadzić warsztaty rozwoju osobistego i pomagać innym.",
    photoUrl: "/images/profiles/karolina.jpg",
    contactPreferences: {
      email: true,
      letter: true,
      phone: true,
    },
    relationshipStatus: "divorced",
    personalityTraits: ["empatyczna", "analityczna", "pomocna"],
    hobbies: ["czytanie książek psychologicznych", "gotowanie", "medytacja"],
    matchingPreferences: {
      minAge: 32,
      maxAge: 50,
      interests: ["psychologia", "rozwój osobisty", "filozofia"],
      lookingFor: "relationship",
      locationPreference: ["Poznań", "Warszawa"],
    },
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-05-10"),
    releaseDateEstimate: new Date("2024-08-15"),
  },
];

export const profileService = {
  // Pobierz wszystkie profile
  async getAllProfiles(): Promise<Profile[]> {
    return profiles;
  },

  // Pobierz profil po ID
  async getProfileById(id: string): Promise<Profile | null> {
    const profile = profiles.find((p) => p.id === id);
    return profile || null;
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

    profiles.push(newProfile);
    return newProfile;
  },

  // Aktualizuj profil
  async updateProfile(
    id: string,
    profileData: Partial<Profile>
  ): Promise<Profile | null> {
    const profileIndex = profiles.findIndex((p) => p.id === id);

    if (profileIndex === -1) {
      return null;
    }

    // Aktualizuj tylko podane pola
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...profileData,
      updatedAt: new Date(),
    };

    return profiles[profileIndex];
  },

  // Usuń profil
  async deleteProfile(id: string): Promise<boolean> {
    const profileIndex = profiles.findIndex((p) => p.id === id);

    if (profileIndex === -1) {
      return false;
    }

    profiles.splice(profileIndex, 1);
    return true;
  },

  // Wyszukaj profile według kryteriów
  async searchProfiles(criteria: {
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
    skills?: string[];
    releaseDate?: { before?: Date; after?: Date };
  }): Promise<Profile[]> {
    return profiles.filter((profile) => {
      if (criteria.minAge && profile.age < criteria.minAge) return false;
      if (criteria.maxAge && profile.age > criteria.maxAge) return false;

      if (
        criteria.facility &&
        !profile.facility
          .toLowerCase()
          .includes(criteria.facility.toLowerCase())
      )
        return false;

      if (criteria.interests && criteria.interests.length > 0) {
        const hasMatchingInterest = criteria.interests.some((interest) =>
          profile.interests.some((profileInterest) =>
            profileInterest.toLowerCase().includes(interest.toLowerCase())
          )
        );
        if (!hasMatchingInterest) return false;
      }

      if (criteria.skills && criteria.skills.length > 0) {
        const hasMatchingSkill = criteria.skills.some((skill) =>
          profile.skills.some((profileSkill) =>
            profileSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }

      if (criteria.releaseDate) {
        if (profile.releaseDateEstimate) {
          if (
            criteria.releaseDate.before &&
            profile.releaseDateEstimate > criteria.releaseDate.before
          )
            return false;
          if (
            criteria.releaseDate.after &&
            profile.releaseDateEstimate < criteria.releaseDate.after
          )
            return false;
        } else {
          // Jeśli brak daty zwolnienia, a kryterium jest określone, odrzuć profil
          return false;
        }
      }

      return true;
    });
  },

  // Pobierz profile z danego zakładu karnego
  async getProfilesByFacility(facility: string): Promise<Profile[]> {
    return profiles.filter((profile) =>
      profile.facility.toLowerCase().includes(facility.toLowerCase())
    );
  },
};
