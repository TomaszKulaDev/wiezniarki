export interface Message {
  id: string;
  matchId: string; // ID powiązanego dopasowania
  senderId: string; // ID nadawcy (więźniarka lub partner)
  senderType: "prisoner" | "partner";
  recipientId: string; // ID odbiorcy
  content: string;
  attachments?: string[]; // URL do załączników
  readStatus: boolean; // czy wiadomość została przeczytana
  moderationStatus: "pending" | "approved" | "rejected"; // status moderacji
  moderationReason?: string; // powód odrzucenia przez moderatora
  createdAt: Date;
  updatedAt: Date;
}
