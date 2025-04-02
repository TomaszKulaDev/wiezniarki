import { NextApiRequest, NextApiResponse } from "next";
import { partnerService } from "../services/partnerService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        if (req.query.id) {
          // Pobierz partnera po ID
          const partner = await partnerService.getPartnerById(
            req.query.id as string
          );
          if (partner) {
            return res.status(200).json(partner);
          } else {
            return res
              .status(404)
              .json({ message: "Partner nie został znaleziony" });
          }
        } else if (req.query.search) {
          // Wyszukaj partnerów wg kryteriów
          const criteria: any = {};

          if (req.query.minAge)
            criteria.minAge = parseInt(req.query.minAge as string);
          if (req.query.maxAge)
            criteria.maxAge = parseInt(req.query.maxAge as string);
          if (req.query.location)
            criteria.location = req.query.location as string;
          if (req.query.interests) {
            criteria.interests = Array.isArray(req.query.interests)
              ? req.query.interests
              : [req.query.interests as string];
          }
          if (req.query.openToPrisonRelationship) {
            criteria.openToPrisonRelationship =
              req.query.openToPrisonRelationship === "true";
          }

          const partners = await partnerService.searchPartners(criteria);
          return res.status(200).json(partners);
        } else {
          // Pobierz wszystkich partnerów
          const partners = await partnerService.getAllPartners();
          return res.status(200).json(partners);
        }

      case "POST":
        // Sprawdzenie autoryzacji (w rzeczywistym projekcie)
        // Tylko administrator, moderator lub sam użytkownik może utworzyć/edytować profil

        // Utwórz nowego partnera
        const newPartner = await partnerService.createPartner(req.body);
        return res.status(201).json(newPartner);

      case "PUT":
        // Sprawdzenie autoryzacji (w rzeczywistym projekcie)

        if (!req.query.id) {
          return res.status(400).json({ message: "Brak ID partnera" });
        }

        // Aktualizuj profil partnera
        const updatedPartner = await partnerService.updatePartner(
          req.query.id as string,
          req.body
        );

        if (updatedPartner) {
          return res.status(200).json(updatedPartner);
        } else {
          return res
            .status(404)
            .json({ message: "Partner nie został znaleziony" });
        }

      case "DELETE":
        // Sprawdzenie autoryzacji (w rzeczywistym projekcie)

        if (!req.query.id) {
          return res.status(400).json({ message: "Brak ID partnera" });
        }

        // Usuń profil partnera
        const deleted = await partnerService.deletePartner(
          req.query.id as string
        );

        if (deleted) {
          return res.status(204).end();
        } else {
          return res
            .status(404)
            .json({ message: "Partner nie został znaleziony" });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: error.message || "Wystąpił błąd podczas przetwarzania żądania",
      });
  }
}
