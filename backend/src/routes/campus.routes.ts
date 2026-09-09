import {
  createCampus,
  deleteCampus,
  getAllCampus,
  getOneCampus,
  updateCampus,
} from "controllers/campus.controller";
import express from "express";
import promotionsRoutes from "./promotions.routes";

const campusRoutes = express.Router({ mergeParams: true });

// GET
campusRoutes.get("/", getAllCampus);
campusRoutes.get("/:id", getOneCampus);

// CREATE
campusRoutes.post("/", createCampus);

// UPDATE
campusRoutes.put("/:id", updateCampus);

// DELETE
campusRoutes.delete("/:id", deleteCampus);

// PROMOTIONS ROUTES
campusRoutes.use("/:campusId/promotion", promotionsRoutes);

export default campusRoutes;
