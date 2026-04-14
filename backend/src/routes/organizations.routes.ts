/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

import { 
   createOrganization, updateOrganization, deleteOrganization, 
   getAllOrganizations, getOneOrganization 
} from "controllers/organizations.controller";
import express from "express";

const organizationsRoutes = express.Router();

// GET ALL
organizationsRoutes.get("/", getAllOrganizations);

// GET ONE
organizationsRoutes.get("/:id", getOneOrganization);

// CREATE
organizationsRoutes.post("/", createOrganization);

// UPDATE
organizationsRoutes.patch("/:id", updateOrganization);

// DELETE
organizationsRoutes.delete("/:id", deleteOrganization)

export default organizationsRoutes;