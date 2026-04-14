/* =========================
   RESSOURCE : ORGANIZATIONS
========================= */

import { getAllOrganizations } from "controllers/organizations.controller";
import express from "express";

const organizationsRoutes = express.Router();

// GET ALL
organizationsRoutes.get("/", getAllOrganizations);

export default organizationsRoutes;