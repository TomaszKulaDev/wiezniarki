import { NextApiRequest, NextApiResponse } from "next";
import { Profile } from "../models/Profile";

// Mock data - in a real app, this would come from a database
const mockProfiles: Profile[] = [
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
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-04-15"),
    releaseDateEstimate: new Date("2024-11-30"),
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get all profiles or a specific profile by ID
      const { id } = req.query;
      if (id) {
        const profile = mockProfiles.find((p) => p.id === id);
        if (profile) {
          res.status(200).json(profile);
        } else {
          res.status(404).json({ message: "Profil nie został znaleziony" });
        }
      } else {
        res.status(200).json(mockProfiles);
      }
      break;

    case "POST":
      // Logic to create a new profile would go here
      res
        .status(501)
        .json({ message: "Funkcjonalność w trakcie implementacji" });
      break;

    case "PUT":
      // Logic to update a profile would go here
      res
        .status(501)
        .json({ message: "Funkcjonalność w trakcie implementacji" });
      break;

    case "DELETE":
      // Logic to delete a profile would go here
      res
        .status(501)
        .json({ message: "Funkcjonalność w trakcie implementacji" });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
