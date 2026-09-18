/* =========================
   RESSOURCE : APPLICATIONS
========================= */

import {
  createApplication,
  deleteApplication,
  getOneApplication,
  updateApplication,
} from "controllers/application.controller";

import express from "express";

const applicationsRoutes = express.Router({ mergeParams: true });

applicationsRoutes.get("/:id", getOneApplication);

applicationsRoutes.post("/", createApplication);

applicationsRoutes.patch("/:id", updateApplication);

applicationsRoutes.delete("/:id", deleteApplication);

export default applicationsRoutes;
