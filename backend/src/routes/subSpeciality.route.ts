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
import { customRateLimiter } from "config/rate-limit";

const subSpecialitiesRoutes = express.Router({ mergeParams: true });

subSpecialitiesRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSubSpeciality,
);

subSpecialitiesRoutes.get("/:id", getOneSubSpeciality);
subSpecialitiesRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSubSpeciality,
);
subSpecialitiesRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSubSpeciality,
);

export default subSpecialitiesRoutes;
