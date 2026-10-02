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
import { customRateLimiter } from "config/rate-limit";

const mediasRoutes = express.Router({ mergeParams: true });

// GET
mediasRoutes.get("/:id", getOneMedia);

// CREATE
mediasRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkUser(Object.values(UserRole), Media),
  createMedia,
);

// UPDATE
mediasRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkUser(Object.values(UserRole), Media),
  updateMedia,
);

// DELETE
mediasRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkUser(Object.values(UserRole), Media),
  deleteMedia,
);

export default mediasRoutes;
