export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  facility: string;
  interests: string[];
  skills: string[];
  bio: string;
  education: string;
  goals: string;
  photoUrl?: string;
  contactPreferences: {
    email: boolean;
    letter: boolean;
    phone: boolean;
  };
  matchingPreferences?: {
    minAge?: number;
    maxAge?: number;
    interests?: string[];
    lookingFor?: "relationship" | "friendship" | "penpal" | "other";
    locationPreference?: string[];
  };
  relationshipStatus: "single" | "complicated" | "divorced" | "widowed";
  personalityTraits: string[];
  hobbies: string[];
  createdAt: Date;
  updatedAt: Date;
  releaseDateEstimate?: Date;
}
