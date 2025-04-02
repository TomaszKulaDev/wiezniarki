export interface User {
  id: string;
  email: string;
  passwordHash: string; // zahaszowane hasło
  role: "prisoner" | "partner" | "admin" | "moderator";
  profileId?: string; // ID powiązanego profilu więźniarki lub partnera
  verified: boolean; // czy konto zostało zweryfikowane
  verificationCode?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  active: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  locked: boolean; // czy konto jest zablokowane
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
