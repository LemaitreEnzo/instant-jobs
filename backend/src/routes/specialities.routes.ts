/* =========================
   RESSOURCE : SPECIALITIES
========================= */

import {
  createSpeciality,
  deleteSpeciality,
  getOneSpeciality,
  updateSpeciality,
} from "controllers/specialities.controller";
import {
  getAllSubSpecialities,
} from "controllers/subSpecialities.controller";
import express from "express";

const specialitiesRoutes = express.Router({ mergeParams: true });

specialitiesRoutes.post("/", createSpeciality);

specialitiesRoutes.get("/:id", getOneSpeciality);
specialitiesRoutes.patch("/:id", updateSpeciality);
specialitiesRoutes.put("/:id", updateSpeciality);
specialitiesRoutes.delete("/:id", deleteSpeciality);

specialitiesRoutes.get("/:specialityId/sub-specialities", getAllSubSpecialities);

export default specialitiesRoutes;
