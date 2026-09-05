/* =========================
   RESSOURCE : SPECIALITIES
========================= */

import {
  createSpeciality,
  deleteSpeciality,
  getAllSpecialities,
  getOneSpeciality,
  updateSpeciality,
} from "controllers/specialities.controller";

import express from "express";
import subSpecialities from "routes/subSpecialities.routes";

const specialitiesRoutes = express.Router();

// GET
specialitiesRoutes.get("/", getAllSpecialities);
specialitiesRoutes.get("/:slug", getOneSpeciality);

// CREATE
specialitiesRoutes.post("/", createSpeciality);

// UPDATE
specialitiesRoutes.patch("/:slug", updateSpeciality);

// DELETE
specialitiesRoutes.delete("/:slug", deleteSpeciality);

// SubSpecialities routes
specialitiesRoutes.use("/:slug/sub-speciality", subSpecialities);

export default specialitiesRoutes;
