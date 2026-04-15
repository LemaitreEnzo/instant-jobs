/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

import { 
   createOrganization, updateOrganization, deleteOrganization, 
   getAllOrganizations, getOneOrganization 
} from "controllers/organizations.controller";
import express from "express";

import usersRoutes from "routes/users.routes";
import campusRoutes from "routes/campus.routes";
import { Organization } from "src/models/organizations.model";


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

export default organizationsRoutes;
