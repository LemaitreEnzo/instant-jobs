/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOneOrganization,
  getCampuses,
  getUsers,
  updateOrganization,
  getApplicationStatistics,
} from "src/controllers/organization.controller";

import { requireRoles } from "../../middlewares/role.middleware";
import { UserRole } from "src/models/enums/user.enum";

import express from "express";

const organizationsRoutes = express.Router({ mergeParams: true });

organizationsRoutes.get("/", getAllOrganizations);

organizationsRoutes.post("/", createOrganization);

organizationsRoutes.get("/:id", getOneOrganization);

organizationsRoutes.patch("/:id", updateOrganization);
organizationsRoutes.put("/:id", updateOrganization);

organizationsRoutes.delete("/:id", deleteOrganization);

organizationsRoutes.get("/:organizationId/campus", getCampuses);

organizationsRoutes.get("/:organizationId/users", getUsers);

organizationsRoutes.get("/:organizationId/statistics/applications",
  requireRoles([UserRole.ADMIN, UserRole.STAFF]),
  getApplicationStatistics
);

export default organizationsRoutes;
