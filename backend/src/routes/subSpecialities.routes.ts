/* =========================
   RESSOURCE : SUB-SPECIALITIES
========================= */

import express from "express";
import {
  createSubSpeciality,
  deleteSubSpeciality,
  getOneSubSpeciality,
  updateSubSpeciality,
} from "controllers/subSpecialities.controller";

const subSpecialitiesRoutes = express.Router({ mergeParams: true });

subSpecialitiesRoutes.post("/", createSubSpeciality);

subSpecialitiesRoutes.get("/:id", getOneSubSpeciality);
subSpecialitiesRoutes.patch("/:id", updateSubSpeciality);
subSpecialitiesRoutes.put("/:id", updateSubSpeciality);
subSpecialitiesRoutes.delete("/:id", deleteSubSpeciality);

export default subSpecialitiesRoutes;
