import { Match } from "../models/Match";
import { Profile } from "../models/Profile";
import { Partner } from "../models/Partner";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const matches: Match[] = [];

// Import symulowanych danych z innych serwisów
// W rzeczywistej aplikacji byłyby to zapytania do bazy danych
import { partnerService } from "./partnerService";
import { profileService } from "./profileService";

export const matchingService = {
  // Pobierz wszystkie matche
  async getAllMatches(): Promise<Match[]> {
    return matches;
  },

  // Pobierz match po ID
  async getMatchById(id: string): Promise<Match | null> {
    const match = matches.find((m) => m.id === id);
    return match || null;
  },

  // Pobierz matche dla danej więźniarki
  async getMatchesForPrisoner(prisonerId: string): Promise<Match[]> {
    return matches.filter((m) => m.prisonerId === prisonerId);
  },

  // Pobierz matche dla danego partnera
  async getMatchesForPartner(partnerId: string): Promise<Match[]> {
    return matches.filter((m) => m.partnerId === partnerId);
  },

  // Utwórz nowy match
  async createMatch(
    prisonerId: string,
    partnerId: string,
    initiatedBy: Match["initiatedBy"]
  ): Promise<Match> {
    // Sprawdź, czy match już istnieje
    const existingMatch = matches.find(
      (m) => m.prisonerId === prisonerId && m.partnerId === partnerId
    );

    if (existingMatch) {
      throw new Error("Match już istnieje");
    }

    // Pobierz profil więźniarki i partnera
    // W rzeczywistej aplikacji byłyby to zapytania do bazy danych
    const prisoner = await profileService.getProfileById(prisonerId);
    const partner = await partnerService.getPartnerById(partnerId);

    if (!prisoner || !partner) {
      throw new Error("Nie znaleziono profilu więźniarki lub partnera");
    }

    // Oblicz wynik dopasowania i powody
    const { score, reasons } = calculateMatchScore(prisoner, partner);

    const newMatch: Match = {
      id: Date.now().toString(),
      prisonerId,
      partnerId,
      status: "pending",
      initiatedBy,
      matchScore: score,
      matchReason: reasons,
      messageCount: 0,
      lastInteraction: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    matches.push(newMatch);
    return newMatch;
  },

  // Zaktualizuj status matchu
  async updateMatchStatus(
    id: string,
    status: Match["status"]
  ): Promise<Match | null> {
    const matchIndex = matches.findIndex((m) => m.id === id);

    if (matchIndex === -1) {
      return null;
    }

    matches[matchIndex].status = status;
    matches[matchIndex].updatedAt = new Date();

    return matches[matchIndex];
  },

  // Usuń match
  async deleteMatch(id: string): Promise<boolean> {
    const matchIndex = matches.findIndex((m) => m.id === id);

    if (matchIndex === -1) {
      return false;
    }

    matches.splice(matchIndex, 1);
    return true;
  },

  // Zwiększ licznik wiadomości
  async incrementMessageCount(id: string): Promise<Match | null> {
    const matchIndex = matches.findIndex((m) => m.id === id);

    if (matchIndex === -1) {
      return null;
    }

    matches[matchIndex].messageCount += 1;
    matches[matchIndex].lastInteraction = new Date();
    matches[matchIndex].updatedAt = new Date();

    return matches[matchIndex];
  },

  // Pobierz rekomendowanych partnerów dla więźniarki
  async getRecommendedPartnersForPrisoner(
    prisonerId: string,
    limit: number = 10
  ): Promise<{ partner: Partner; score: number; reasons: string[] }[]> {
    const prisoner = await profileService.getProfileById(prisonerId);

    if (!prisoner) {
      throw new Error("Nie znaleziono profilu więźniarki");
    }

    const allPartners = await partnerService.getAllPartners();
    const verifiedPartners = allPartners.filter((p) => p.verified);

    // Oblicz wynik dopasowania dla każdego partnera
    const recommendations = verifiedPartners.map((partner) => {
      const { score, reasons } = calculateMatchScore(prisoner, partner);
      return { partner, score, reasons };
    });

    // Sortuj według wyniku dopasowania (od najwyższego)
    recommendations.sort((a, b) => b.score - a.score);

    // Zwróć ograniczoną liczbę rekomendacji
    return recommendations.slice(0, limit);
  },

  // Pobierz rekomendowane więźniarki dla partnera
  async getRecommendedPrisonersForPartner(
    partnerId: string,
    limit: number = 10
  ): Promise<{ prisoner: Profile; score: number; reasons: string[] }[]> {
    const partner = await partnerService.getPartnerById(partnerId);

    if (!partner) {
      throw new Error("Nie znaleziono profilu partnera");
    }

    const allPrisoners = await profileService.getAllProfiles();

    // Oblicz wynik dopasowania dla każdej więźniarki
    const recommendations = allPrisoners.map((prisoner) => {
      const { score, reasons } = calculateMatchScore(prisoner, partner);
      return { prisoner, score, reasons };
    });

    // Sortuj według wyniku dopasowania (od najwyższego)
    recommendations.sort((a, b) => b.score - a.score);

    // Zwróć ograniczoną liczbę rekomendacji
    return recommendations.slice(0, limit);
  },
};

// Funkcja pomocnicza do obliczania wyniku dopasowania
function calculateMatchScore(
  prisoner: Profile,
  partner: Partner
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Sprawdzenie wieku
  const partnerPrefsMinAge = partner.matchingPreferences.minAge || 18;
  const partnerPrefsMaxAge = partner.matchingPreferences.maxAge || 100;
  const prisonerPrefsMinAge = prisoner.matchingPreferences?.minAge || 18;
  const prisonerPrefsMaxAge = prisoner.matchingPreferences?.maxAge || 100;

  if (
    prisoner.age >= partnerPrefsMinAge &&
    prisoner.age <= partnerPrefsMaxAge
  ) {
    score += 15;
    reasons.push("Wiek w preferencjach partnera");
  }

  if (
    partner.age >= prisonerPrefsMinAge &&
    partner.age <= prisonerPrefsMaxAge
  ) {
    score += 15;
    reasons.push("Wiek w preferencjach więźniarki");
  }

  // Wspólne zainteresowania
  const commonInterests = prisoner.interests.filter((interest) =>
    partner.interests.some(
      (partnerInterest) =>
        partnerInterest.toLowerCase() === interest.toLowerCase()
    )
  );

  if (commonInterests.length > 0) {
    score += commonInterests.length * 5;
    reasons.push(`Wspólne zainteresowania: ${commonInterests.join(", ")}`);
  }

  // Preferencje co do rodzaju relacji
  const lookingFor = prisoner.matchingPreferences?.lookingFor || "friendship";
  if (
    lookingFor === "relationship" &&
    partner.matchingPreferences.openToPrisonRelationship
  ) {
    score += 20;
    reasons.push("Oboje są otwarci na związek");
  }

  // Preferencje co do odwiedzin
  if (partner.matchingPreferences.visitingWillingness === "yes") {
    score += 10;
    reasons.push("Partner jest chętny do odwiedzin");
  }

  // Gotowość do korespondencji
  if (partner.matchingPreferences.correspondenceWillingness === "yes") {
    score += 15;
    reasons.push("Partner jest chętny do korespondencji");
  }

  // Różnorodność osobowości (opcjonalne)
  const complementaryTraits = partner.personalityTraits.filter(
    (trait) => !prisoner.personalityTraits.includes(trait)
  );

  if (complementaryTraits.length > 0) {
    score += complementaryTraits.length * 2;
    reasons.push("Uzupełniające się cechy osobowości");
  }

  // Normalizacja wyniku do skali 0-100
  score = Math.min(score, 100);

  return { score, reasons };
}
