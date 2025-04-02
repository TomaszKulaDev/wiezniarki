import { Partner } from "../models/Partner";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const partners: Partner[] = [
  {
    id: "1",
    firstName: "Adam",
    lastName: "N.",
    age: 34,
    location: "Warszawa",
    occupation: "Programista",
    interests: ["podróże", "literatura", "film"],
    hobbies: ["gotowanie", "fotografia", "bieganie"],
    bio: "Szukam osoby, z którą będę mógł szczerze rozmawiać. Jestem otwarty na wszystkich ludzi, niezależnie od ich historii.",
    education: "Wyższe - informatyka",
    photos: ["/images/partners/adam1.jpg", "/images/partners/adam2.jpg"],
    contactInfo: {
      email: "adam@example.com",
    },
    matchingPreferences: {
      minAge: 25,
      maxAge: 40,
      interests: ["literatura", "sztuka", "muzyka"],
      openToPrisonRelationship: true,
      visitingWillingness: "yes",
      correspondenceWillingness: "yes",
    },
    relationshipStatus: "single",
    personalityTraits: ["empatyczny", "cierpliwy", "otwarty"],
    verified: true,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "2",
    firstName: "Michał",
    lastName: "K.",
    age: 39,
    location: "Kraków",
    occupation: "Nauczyciel",
    interests: ["historia", "psychologia", "edukacja"],
    hobbies: ["gra na gitarze", "wędrówki", "czytanie"],
    bio: "Wierzę w drugie szanse i możliwość zmiany. Szukam prawdziwej relacji opartej na szczerości i zaufaniu.",
    education: "Wyższe - historia",
    photos: ["/images/partners/michal1.jpg"],
    contactInfo: {
      email: "michal@example.com",
      phone: "+48123456789",
    },
    matchingPreferences: {
      minAge: 30,
      maxAge: 45,
      interests: ["historia", "filozofia", "muzyka"],
      openToPrisonRelationship: true,
      visitingWillingness: "yes",
      correspondenceWillingness: "yes",
    },
    relationshipStatus: "divorced",
    personalityTraits: ["wyrozumiały", "spokojny", "rozważny"],
    verified: true,
    createdAt: new Date("2023-02-12"),
    updatedAt: new Date("2023-04-10"),
  },
];

export const partnerService = {
  // Pobierz wszystkich partnerów
  async getAllPartners(): Promise<Partner[]> {
    return partners;
  },

  // Pobierz partnera po ID
  async getPartnerById(id: string): Promise<Partner | null> {
    const partner = partners.find((p) => p.id === id);
    return partner || null;
  },

  // Utwórz nowy profil partnera
  async createPartner(
    partnerData: Omit<Partner, "id" | "verified" | "createdAt" | "updatedAt">
  ): Promise<Partner> {
    const newPartner: Partner = {
      ...partnerData,
      id: Date.now().toString(),
      verified: false, // Nowi partnerzy muszą przejść weryfikację
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    partners.push(newPartner);
    return newPartner;
  },

  // Aktualizuj profil partnera
  async updatePartner(
    id: string,
    partnerData: Partial<Partner>
  ): Promise<Partner | null> {
    const partnerIndex = partners.findIndex((p) => p.id === id);

    if (partnerIndex === -1) {
      return null;
    }

    // Aktualizuj tylko podane pola
    partners[partnerIndex] = {
      ...partners[partnerIndex],
      ...partnerData,
      updatedAt: new Date(),
    };

    return partners[partnerIndex];
  },

  // Usuń profil partnera
  async deletePartner(id: string): Promise<boolean> {
    const partnerIndex = partners.findIndex((p) => p.id === id);

    if (partnerIndex === -1) {
      return false;
    }

    partners.splice(partnerIndex, 1);
    return true;
  },

  // Zweryfikuj partnera
  async verifyPartner(id: string): Promise<Partner | null> {
    const partnerIndex = partners.findIndex((p) => p.id === id);

    if (partnerIndex === -1) {
      return null;
    }

    partners[partnerIndex].verified = true;
    partners[partnerIndex].updatedAt = new Date();

    return partners[partnerIndex];
  },

  // Wyszukaj partnerów według kryteriów
  async searchPartners(criteria: {
    minAge?: number;
    maxAge?: number;
    location?: string;
    interests?: string[];
    openToPrisonRelationship?: boolean;
  }): Promise<Partner[]> {
    return partners.filter((partner) => {
      if (criteria.minAge && partner.age < criteria.minAge) return false;
      if (criteria.maxAge && partner.age > criteria.maxAge) return false;
      if (
        criteria.location &&
        !partner.location
          .toLowerCase()
          .includes(criteria.location.toLowerCase())
      )
        return false;
      if (criteria.interests && criteria.interests.length > 0) {
        const hasMatchingInterest = criteria.interests.some((interest) =>
          partner.interests.some((partnerInterest) =>
            partnerInterest.toLowerCase().includes(interest.toLowerCase())
          )
        );
        if (!hasMatchingInterest) return false;
      }
      if (
        criteria.openToPrisonRelationship !== undefined &&
        partner.matchingPreferences.openToPrisonRelationship !==
          criteria.openToPrisonRelationship
      ) {
        return false;
      }

      return true;
    });
  },
};
