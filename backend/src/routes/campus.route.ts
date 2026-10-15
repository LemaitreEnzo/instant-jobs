/**
 * Campus routing definitions.
 * Mounted under /campus with parent-level `authenticateUser` middleware.
 * Restricts creations and deletions to Admin, allows modifications for Admin and Staff.
 */
import {
  createCampus,
  deleteCampus,
  getOneCampus,
  getPromotions,
  updateCampus,
} from "controllers/campus.controller";
import express from "express";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";
import { customRateLimiter } from "config/rate-limit";

const campusRoutes = express.Router({ mergeParams: true });

// POST / - Auth: Admin only
campusRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN]),
  createCampus,
);

// GET /:id - Auth: Any authenticated user
campusRoutes.get("/:id", getOneCampus);

// PATCH /:id - Auth: Admin, Staff
campusRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateCampus,
);

// DELETE /:id - Auth: Admin only
campusRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN]),
  deleteCampus,
);

// GET /:campusId/promotions - Auth: Any authenticated user
campusRoutes.get("/:campusId/promotions", getPromotions);

export default campusRoutes;
