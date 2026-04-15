import {
  createCampus,
  deleteCampus,
  getAllCampus,
  getOneCampus,
  updateCampus,
} from "controllers/campus.controller";
import express from "express";

const campusRoutes = express.Router();

// GET
campusRoutes.get("/", getAllCampus);
campusRoutes.get("/:slug", getOneCampus);

// CREATE
campusRoutes.post("/", createCampus);

// UPDATE
campusRoutes.put("/:slug", updateCampus);

// DELETE
campusRoutes.delete("/:slug", deleteCampus);

export default campusRoutes;
