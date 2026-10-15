/**
 * Speciality routing definitions.
 * Mounted under /speciality with parent-level `authenticateUser` middleware.
 * Restricts curriculum speciality mutations to Admin and Staff roles.
 */
import express from "express";
import {
  createSpeciality,
  deleteSpeciality,
  getOneSpeciality,
  getSubSpecialities,
  updateSpeciality,
} from "src/controllers/speciality.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";
import { customRateLimiter } from "config/rate-limit";

const specialitiesRoutes = express.Router({ mergeParams: true });

// POST / - Auth: Admin, Staff
specialitiesRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSpeciality,
);

// GET /:id - Auth: Any authenticated user
specialitiesRoutes.get("/:id", getOneSpeciality);

// PATCH /:id - Auth: Admin, Staff
specialitiesRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSpeciality,
);

// DELETE /:id - Auth: Admin, Staff
specialitiesRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSpeciality,
);

// GET /:specialityId/sub-specialities - Auth: Any authenticated user
specialitiesRoutes.get("/:specialityId/sub-specialities", getSubSpecialities);

export default specialitiesRoutes;
