/* =========================
   RESSOURCE : SUB-SPECIALITIES
========================= */

import express from "express";
import {
  createSubSpeciality,
  deleteSubSpeciality,
  getOneSubSpeciality,
  updateSubSpeciality,
} from "src/controllers/subSpeciality.controller";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";

const subSpecialitiesRoutes = express.Router({ mergeParams: true });

subSpecialitiesRoutes.post(
  "/",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSubSpeciality,
);

subSpecialitiesRoutes.get("/:id", getOneSubSpeciality);
subSpecialitiesRoutes.patch(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSubSpeciality,
);
subSpecialitiesRoutes.delete(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSubSpeciality,
);

export default subSpecialitiesRoutes;
