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
import { customRateLimiter } from "config/rate-limit";

const specialitiesRoutes = express.Router({ mergeParams: true });

specialitiesRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createSpeciality,
);

specialitiesRoutes.get("/:id", getOneSpeciality);
specialitiesRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateSpeciality,
);
specialitiesRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteSpeciality,
);

specialitiesRoutes.get("/:specialityId/sub-specialities", getSubSpecialities);

export default specialitiesRoutes;
