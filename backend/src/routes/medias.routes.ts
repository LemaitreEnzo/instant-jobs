import {
  createMedia,
  deleteMedia,
  getAllMedias,
  getOneMedia,
  updateMedia,
} from "controllers/medias.controller";
import express from "express";

const mediasRoutes = express.Router();

// GET
mediasRoutes.get("/", getAllMedias);
mediasRoutes.get("/:id", getOneMedia);

// CREATE
mediasRoutes.post("/", createMedia);

// UPDATE
mediasRoutes.patch("/:id", updateMedia);

// DELETE
mediasRoutes.delete("/:id", deleteMedia);

export default mediasRoutes;
