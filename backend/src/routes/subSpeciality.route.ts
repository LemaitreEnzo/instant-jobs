/**
 * SubSpeciality routing definitions.
 * Mounted under /sub-speciality with parent-level `authenticateUser` middleware.
 * Restricts sub-speciality mutations to Admin and Staff roles.
 */
import express from "express";
import {
  createSubSpeciality,
  deleteSubSpeciality,
  getOneSubSpeciality,
  updateSubSpeciality,
} from "src/controllers/subSpeciality.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";
import { customRateLimiter } from "config/rate-limit";

const subSpecialitiesRoutes = express.Router({ mergeParams: true });

// POST / - Auth: Admin, Staff
subSpecialitiesRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSubSpeciality,
);

// GET /:id - Auth: Any authenticated user
subSpecialitiesRoutes.get("/:id", getOneSubSpeciality);

// PATCH /:id - Auth: Admin, Staff
subSpecialitiesRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSubSpeciality,
);

// DELETE /:id - Auth: Admin, Staff
subSpecialitiesRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSubSpeciality,
);

export default subSpecialitiesRoutes;
