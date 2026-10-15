/**
 * Organization routing definitions.
 * Mounted under /organization with parent-level `authenticateUser` middleware.
 * Enforces admin-only mutation policies with rate limiting.
 */
import { customRateLimiter } from "config/rate-limit";
import express from "express";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getCampuses,
  getOneOrganization,
  getUsers,
  updateOrganization,
} from "src/controllers/organization.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";

const organizationsRoutes = express.Router({ mergeParams: true });

// GET / - Auth: Any authenticated user
organizationsRoutes.get("/", getAllOrganizations);

// POST / - Auth: Admin only
organizationsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN]),
  createOrganization,
);

// GET /:id - Auth: Any authenticated user
organizationsRoutes.get("/:id", getOneOrganization);

// PATCH /:id - Auth: Admin only
organizationsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN]),
  updateOrganization,
);

// DELETE /:id - Auth: Admin only
organizationsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN]),
  deleteOrganization,
);

// GET /:organizationId/campuses - Auth: Any authenticated user
organizationsRoutes.get("/:organizationId/campuses", getCampuses);

// GET /:organizationId/users - Auth: Any authenticated user
organizationsRoutes.get("/:organizationId/users", getUsers);

export default organizationsRoutes;
