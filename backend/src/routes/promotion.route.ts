/* =========================
   RESSOURCE : PROMOTIONS
========================= */

import express from "express";
import {
  createPromotion,
  deletePromotion,
  getOnePromotion,
  getSpecialities,
  updatePromotion,
} from "src/controllers/promotion.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";

const promotionsRoutes = express.Router({ mergeParams: true });

promotionsRoutes.post(
  "/",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createPromotion,
);

promotionsRoutes.get("/:id", getOnePromotion);
promotionsRoutes.patch(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updatePromotion,
);
promotionsRoutes.delete(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deletePromotion,
);

promotionsRoutes.get("/:promotionId/specialities", getSpecialities);

export default promotionsRoutes;
