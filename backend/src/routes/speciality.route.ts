/* =========================
   RESSOURCE : SPECIALITIES
========================= */

import {
  createSpeciality,
  deleteSpeciality,
  getOneSpeciality,
  getSubSpecialities,
  updateSpeciality,
} from "src/controllers/speciality.controller";
import express from "express";

const specialitiesRoutes = express.Router({ mergeParams: true });

specialitiesRoutes.post("/", createSpeciality);

specialitiesRoutes.get("/:id", getOneSpeciality);
specialitiesRoutes.patch("/:id", updateSpeciality);
specialitiesRoutes.put("/:id", updateSpeciality);
specialitiesRoutes.delete("/:id", deleteSpeciality);

specialitiesRoutes.get(
  "/:specialityId/sub-specialities",
  getSubSpecialities,
);

export default specialitiesRoutes;
