/* =========================
   RESSOURCE : PROMOTIONS
========================= */

import express from "express";
import {
  createPromotion,
  deletePromotion,
  getOnePromotion,
  updatePromotion,
} from "controllers/promotions.controller";
import {
  getAllSpecialities,
} from "controllers/specialities.controller";

const promotionsRoutes = express.Router({ mergeParams: true });

promotionsRoutes.post("/", createPromotion);

promotionsRoutes.get("/:id", getOnePromotion);
promotionsRoutes.patch("/:id", updatePromotion);
promotionsRoutes.put("/:id", updatePromotion);
promotionsRoutes.delete("/:id", deletePromotion);

promotionsRoutes.get("/:promotionId/specialities", getAllSpecialities);

export default promotionsRoutes;
