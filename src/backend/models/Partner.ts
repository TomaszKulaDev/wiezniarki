export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  occupation: string;
  interests: string[];
  hobbies: string[];
  bio: string;
  education: string;
  photos: string[];
  contactInfo: {
    email: string;
    phone?: string;
  };
  matchingPreferences: {
    minAge?: number;
    maxAge?: number;
    interests?: string[];
    openToPrisonRelationship: boolean;
    visitingWillingness?: "yes" | "maybe" | "no";
    correspondenceWillingness?: "yes" | "maybe" | "no";
  };
  relationshipStatus: "single" | "divorced" | "widowed";
  personalityTraits: string[];
  verified: boolean; // czy użytkownik został zweryfikowany
  createdAt: Date;
  updatedAt: Date;
}
