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
campusRoutes.get("/:id", getOneCampus);

// CREATE
campusRoutes.post("/", createCampus);

// UPDATE
campusRoutes.patch("/:id", updateCampus);

// DELETE
campusRoutes.delete("/:id", deleteCampus);

export default campusRoutes;
