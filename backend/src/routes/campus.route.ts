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

const campusRoutes = express.Router({ mergeParams: true });

campusRoutes.post("/", checkRole([UserRole.ADMIN]), createCampus);

campusRoutes.get("/:id", getOneCampus);
campusRoutes.patch(
  "/:id",
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  updateCampus,
);
campusRoutes.delete("/:id", checkRole([UserRole.ADMIN]), deleteCampus);

campusRoutes.get("/:campusId/promotions", getPromotions);

export default campusRoutes;
