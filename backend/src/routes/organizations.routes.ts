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
import express from "express";

import campusRoutes from "routes/campus.routes";
import usersRoutes from "routes/users.routes";

const organizationsRoutes = express.Router({ mergeParams: true });

// GET ALL
organizationsRoutes.get("/", getAllOrganizations);

// GET ONE
organizationsRoutes.get("/:id", getOneOrganization);

// CREATE
organizationsRoutes.post("/", createOrganization);

// UPDATE
organizationsRoutes.put("/:id", updateOrganization);

// DELETE
organizationsRoutes.delete("/:id", deleteOrganization);

// USERS ROUTES
organizationsRoutes.use("/:organizationId/users", usersRoutes);

// CAMPUS ROUTES
organizationsRoutes.use("/:organizationId/campus", campusRoutes);

export default organizationsRoutes;
