/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

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

organizationsRoutes.post("/", checkRole([UserRole.ADMIN]), createOrganization);

organizationsRoutes.get("/:id", getOneOrganization);

organizationsRoutes.patch(
  "/:id",
  checkRole([UserRole.ADMIN]),
  updateOrganization,
);

organizationsRoutes.delete(
  "/:id",
  checkRole([UserRole.ADMIN]),
  deleteOrganization,
);

organizationsRoutes.get("/:organizationId/campus", getCampuses);

organizationsRoutes.get("/:organizationId/users", getUsers);

export default organizationsRoutes;
