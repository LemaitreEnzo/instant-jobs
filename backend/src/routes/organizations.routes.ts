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
import { getAllUsers } from "src/controllers/users.controller";

const organizationsRoutes = express.Router({ mergeParams: true });

organizationsRoutes.get("/", getAllOrganizations);

organizationsRoutes.post("/", createOrganization);

organizationsRoutes.get("/:id", getOneOrganization);

organizationsRoutes.patch("/:id", updateOrganization);
organizationsRoutes.put("/:id", updateOrganization);

organizationsRoutes.delete("/:id", deleteOrganization);

organizationsRoutes.get("/:organizationId/campus", getAllCampus);

organizationsRoutes.use("/:organizationId/users", getAllUsers);

export default organizationsRoutes;
