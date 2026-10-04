/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

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

organizationsRoutes.get("/", getAllOrganizations);

organizationsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN]),
  createOrganization,
);

organizationsRoutes.get("/:id", getOneOrganization);

organizationsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN]),
  updateOrganization,
);

organizationsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN]),
  deleteOrganization,
);

organizationsRoutes.get("/:organizationId/campuses", getCampuses);

organizationsRoutes.get("/:organizationId/users", getUsers);

export default organizationsRoutes;
