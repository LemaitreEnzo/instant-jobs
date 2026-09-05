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
organizationsRoutes.get("/:slug", getOneOrganization);

// CREATE
organizationsRoutes.post("/", createOrganization);

// UPDATE
organizationsRoutes.put("/:slug", updateOrganization);

// DELETE
organizationsRoutes.delete("/:slug", deleteOrganization);

// USERS ROUTES
organizationsRoutes.use("/:slug/users", usersRoutes);

// CAMPUS ROUTES
organizationsRoutes.use("/:slug/campus", campusRoutes);

export default organizationsRoutes;
