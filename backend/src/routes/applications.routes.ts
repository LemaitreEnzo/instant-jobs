/* =========================
   RESSOURCE : APPLICATIONS
========================= */

import {
  createApplication,
  deleteApplication,
  getAllApplications,
  getOneApplication,
  updateApplication,
} from "controllers/application.controller";

import express from "express";
import mediasRoutes from "routes/medias.routes";

const applicationsRoutes = express.Router();

// GET
applicationsRoutes.get("/", getAllApplications);
applicationsRoutes.get("/:id", getOneApplication);

// CREATE
applicationsRoutes.post("/", createApplication);

// UPDATE
applicationsRoutes.patch("/:id", updateApplication);

// DELETE
applicationsRoutes.delete("/:id", deleteApplication);

// Medias routes
applicationsRoutes.use("/:id/docs/media", mediasRoutes);

export default applicationsRoutes;
