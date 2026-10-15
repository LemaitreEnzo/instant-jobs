/**
 * Media routing definitions.
 * Mounted under /media with parent-level `authenticateUser` middleware.
 * Restricts access and modifications to resource owners or Admin/Staff via `checkUser`.
 */
import { customRateLimiter } from "config/rate-limit";
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

// GET /:id - Auth: Admin, Staff, or media owner (student)
mediasRoutes.get(
  "/:id",
  checkUser(Object.values(UserRole), Media),
  getOneMedia,
);

// POST / - Auth: Any role with self-ownership enforced for students
mediasRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkUser(Object.values(UserRole), Media),
  createMedia,
);

// PATCH /:id - Auth: Admin, Staff, or media owner (student)
mediasRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkUser(Object.values(UserRole), Media),
  updateMedia,
);

// DELETE /:id - Auth: Admin, Staff, or media owner (student)
mediasRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkUser(Object.values(UserRole), Media),
  deleteMedia,
);

export default mediasRoutes;
