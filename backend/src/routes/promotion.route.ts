/**
 * Promotion routing definitions.
 * Mounted under /promotion with parent-level `authenticateUser` middleware.
 * Restricts cohort management mutations to Admin and Staff roles.
 */
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

// POST / - Auth: Admin, Staff
promotionsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createPromotion,
);

// GET /:id - Auth: Any authenticated user
promotionsRoutes.get("/:id", getOnePromotion);

// PATCH /:id - Auth: Admin, Staff
promotionsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updatePromotion,
);

// DELETE /:id - Auth: Admin, Staff
promotionsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deletePromotion,
);

// GET /:promotionId/specialities - Auth: Any authenticated user
promotionsRoutes.get("/:promotionId/specialities", getSpecialities);

export default promotionsRoutes;
