/**
 * Application routing definitions.
 * Mounted under /application with parent-level `authenticateUser` middleware.
 * Enforces resource ownership via `checkUser` with the Application model.
 */
import {
  createApplication,
  deleteApplication,
  getAppointmentsByApplication,
  getOneApplication,
  updateApplication,
} from "controllers/application.controller";

import { customRateLimiter } from "config/rate-limit";
import express from "express";
import { Application } from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import { checkUser } from "../../middlewares/auth.middleware";

const applicationsRoutes = express.Router({ mergeParams: true });

// GET /:id - Auth: Any authenticated user
applicationsRoutes.get("/:id", getOneApplication);

// POST / - Auth: Any role with self-ownership enforced for students
applicationsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkUser(Object.values(UserRole), Application),
  createApplication,
);

// PATCH /:id - Auth: Admin, Staff, or application owner (student)
applicationsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkUser(Object.values(UserRole), Application),
  updateApplication,
);

// DELETE /:id - Auth: Admin, Staff, or application owner (student)
applicationsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkUser(Object.values(UserRole), Application),
  deleteApplication,
);

// GET /:applicationId/appointments - Auth: Any authenticated user
applicationsRoutes.get(
  "/:applicationId/appointments",
  getAppointmentsByApplication,
);

export default applicationsRoutes;
