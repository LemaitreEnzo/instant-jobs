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
import { customRateLimiter } from "config/rate-limit";

const promotionsRoutes = express.Router({ mergeParams: true });

promotionsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createPromotion,
);

promotionsRoutes.get("/:id", getOnePromotion);
promotionsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updatePromotion,
);
promotionsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deletePromotion,
);

promotionsRoutes.get("/:promotionId/specialities", getSpecialities);

export default promotionsRoutes;
