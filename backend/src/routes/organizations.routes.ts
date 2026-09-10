/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOneOrganization,
  updateOrganization,
} from "controllers/organizations.controller";
import {
  getAllCampus,
} from "controllers/campus.controller";
import express from "express";
import usersRoutes from "routes/users.routes";

const organizationsRoutes = express.Router({ mergeParams: true });

organizationsRoutes.get("/", getAllOrganizations);

organizationsRoutes.post("/", createOrganization);

organizationsRoutes.get("/:id", getOneOrganization);

organizationsRoutes.patch("/:id", updateOrganization);
organizationsRoutes.put("/:id", updateOrganization);

organizationsRoutes.delete("/:id", deleteOrganization);

organizationsRoutes.get("/:organizationId/campus", getAllCampus);

organizationsRoutes.use("/:organizationId/users", usersRoutes);

export default organizationsRoutes;
