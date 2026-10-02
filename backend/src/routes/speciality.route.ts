/* =========================
   RESSOURCE : SPECIALITIES
========================= */

import express from "express";
import {
  createSpeciality,
  deleteSpeciality,
  getOneSpeciality,
  getSubSpecialities,
  updateSpeciality,
} from "src/controllers/speciality.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";

const specialitiesRoutes = express.Router({ mergeParams: true });

specialitiesRoutes.post(
  "/",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSpeciality,
);

specialitiesRoutes.get(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  getOneSpeciality,
);
specialitiesRoutes.patch(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSpeciality,
);
specialitiesRoutes.delete(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSpeciality,
);

specialitiesRoutes.get("/:specialityId/sub-specialities", getSubSpecialities);

export default specialitiesRoutes;
