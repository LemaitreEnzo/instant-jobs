/* =========================
   RESSOURCE : PROMOTIONS
========================= */

import {
  createPromotion,
  deletePromotion,
  getOnePromotion,
  getSpecialities,
  updatePromotion,
} from "src/controllers/promotion.controller";
import express from "express";

const promotionsRoutes = express.Router({ mergeParams: true });

promotionsRoutes.post("/", createPromotion);

promotionsRoutes.get("/:id", getOnePromotion);
promotionsRoutes.patch("/:id", updatePromotion);
promotionsRoutes.put("/:id", updatePromotion);
promotionsRoutes.delete("/:id", deletePromotion);

promotionsRoutes.get("/:promotionId/specialities", getSpecialities);

export default promotionsRoutes;
