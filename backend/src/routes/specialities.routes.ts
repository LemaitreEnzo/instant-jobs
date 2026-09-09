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

const specialitiesRoutes = express.Router({ mergeParams: true });

// GET
specialitiesRoutes.get("/", getAllSpecialities);
specialitiesRoutes.get("/:id", getOneSpeciality);

// CREATE
specialitiesRoutes.post("/", createSpeciality);

// UPDATE
specialitiesRoutes.patch("/:id", updateSpeciality);

// DELETE
specialitiesRoutes.delete("/:id", deleteSpeciality);

// SubSpecialities routes
specialitiesRoutes.use("/:specialityId/sub-speciality", subSpecialities);

export default specialitiesRoutes;
