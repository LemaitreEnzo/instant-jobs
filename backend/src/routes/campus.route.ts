/* =========================
   RESSOURCE : CAMPUSES
========================= */

import {
  createCampus,
  deleteCampus,
  getPromotions,
  getOneCampus,
  updateCampus,
} from "controllers/campus.controller";
import express from "express";

const campusRoutes = express.Router({ mergeParams: true });

campusRoutes.post("/", createCampus);

campusRoutes.get("/:id", getOneCampus);
campusRoutes.patch("/:id", updateCampus);
campusRoutes.put("/:id", updateCampus);
campusRoutes.delete("/:id", deleteCampus);

campusRoutes.get("/:campusId/promotions", getPromotions);

export default campusRoutes;
