export interface Match {
  id: string;
  prisonerId: string; // ID więźniarki
  partnerId: string; // ID potencjalnego partnera
  status: "pending" | "accepted" | "rejected" | "blocked";
  initiatedBy: "prisoner" | "partner";
  matchScore: number; // 0-100
  matchReason: string[]; // powody dopasowania, np. wspólne zainteresowania
  messageCount: number; // liczba wymienionych wiadomości
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}
