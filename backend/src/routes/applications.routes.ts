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

const applicationsRoutes = express.Router({ mergeParams: true });

// GET
applicationsRoutes.get("/", getAllApplications);
applicationsRoutes.get("/:id", getOneApplication);

// CREATE
applicationsRoutes.post("/", createApplication);

// UPDATE
applicationsRoutes.patch("/:id", updateApplication);

// DELETE
applicationsRoutes.delete("/:id", deleteApplication);

export default applicationsRoutes;
