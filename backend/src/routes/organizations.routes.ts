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
import promotionsRoutes from "./promotions.routes";

const organizationsRoutes = express.Router();

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

// SUBSPECIALITIES ROUTES
organizationsRoutes.use("/:slug/promotion", promotionsRoutes);

export default organizationsRoutes;
