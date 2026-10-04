/* =========================
   RESSOURCE : CAMPUSES
========================= */

import {
  createCampus,
  deleteCampus,
  getOneCampus,
  getPromotions,
  updateCampus,
} from "controllers/campus.controller";
import express from "express";
import { UserRole } from "src/models/enums/user.enum";
import { checkRole } from "../../middlewares/role.middleware";
import { customRateLimiter } from "config/rate-limit";

const campusRoutes = express.Router({ mergeParams: true });

campusRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkRole([UserRole.ADMIN]),
  createCampus,
);

campusRoutes.get("/:id", getOneCampus);
campusRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateCampus,
);
campusRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkRole([UserRole.ADMIN]),
  deleteCampus,
);

campusRoutes.get("/:campusId/promotions", getPromotions);

export default campusRoutes;
