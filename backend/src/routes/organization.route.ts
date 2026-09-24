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
} from "src/controllers/organization.controller";
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

export default organizationsRoutes;
