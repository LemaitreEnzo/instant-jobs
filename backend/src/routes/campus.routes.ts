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
campusRoutes.get("/:slug", getOneCampus);

// CREATE
campusRoutes.post("/", createCampus);

// UPDATE
campusRoutes.put("/:slug", updateCampus);

// DELETE
campusRoutes.delete("/:slug", deleteCampus);

// PROMOTIONS ROUTES
campusRoutes.use("/:slug/promotion", promotionsRoutes);

export default campusRoutes;
