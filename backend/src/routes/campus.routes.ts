/* =========================
   RESSOURCE : CAMPUSES
========================= */

import {
  createCampus,
  deleteCampus,
  getOneCampus,
  updateCampus,
} from "controllers/campus.controller";
import {
  getAllPromotions,
} from "controllers/promotions.controller";
import express from "express";

const campusRoutes = express.Router({ mergeParams: true });

campusRoutes.post("/", createCampus);

campusRoutes.get("/:id", getOneCampus);
campusRoutes.patch("/:id", updateCampus);
campusRoutes.put("/:id", updateCampus);
campusRoutes.delete("/:id", deleteCampus);

campusRoutes.get("/:campusId/promotions", getAllPromotions);

export default campusRoutes;
