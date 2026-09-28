import {
  createMedia,
  deleteMedia,
  getOneMedia,
  updateMedia,
} from "src/controllers/media.controller";
import express from "express";

const mediasRoutes = express.Router({ mergeParams: true });

// GET
mediasRoutes.get("/:id", getOneMedia);

// CREATE
mediasRoutes.post("/", createMedia);

// UPDATE
mediasRoutes.patch("/:id", updateMedia);

// DELETE
mediasRoutes.delete("/:id", deleteMedia);

export default mediasRoutes;
