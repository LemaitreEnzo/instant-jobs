import express from "express";
import {
  createMedia,
  deleteMedia,
  getOneMedia,
  updateMedia,
} from "src/controllers/media.controller";
import { Media } from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import { checkUser } from "../../middlewares/auth.middleware";

const mediasRoutes = express.Router({ mergeParams: true });

// GET
mediasRoutes.get("/:id", getOneMedia);

// CREATE
mediasRoutes.post("/", checkUser(Object.values(UserRole), Media), createMedia);

// UPDATE
mediasRoutes.patch(
  "/:id",
  checkUser(Object.values(UserRole), Media),
  updateMedia,
);

// DELETE
mediasRoutes.delete(
  "/:id",
  checkUser(Object.values(UserRole), Media),
  deleteMedia,
);

export default mediasRoutes;
