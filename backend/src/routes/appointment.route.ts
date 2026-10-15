/**
 * Appointment routing definitions.
 * Mounted under /appointment with parent-level `authenticateUser` middleware.
 * Enforces ownership and access verification via `checkUser` with Appointment model.
 */
import {
  createAppointment,
  deleteAppointment,
  getOneAppointment,
  updateAppointment,
} from "controllers/appointment.controller";

import { customRateLimiter } from "config/rate-limit";
import express from "express";
import { Appointment } from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import { checkUser } from "../../middlewares/auth.middleware";

const appointmentsRoutes = express.Router({ mergeParams: true });

// GET /:id - Auth: Admin, Staff, or appointment owner (student)
appointmentsRoutes.get(
  "/:id",
  checkUser(Object.values(UserRole), Appointment),
  getOneAppointment,
);

// POST / - Auth: Any role with self-ownership enforced for students
appointmentsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkUser(Object.values(UserRole), Appointment),
  createAppointment,
);

// PATCH /:id - Auth: Admin, Staff, or appointment owner (student)
appointmentsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkUser(Object.values(UserRole), Appointment),
  updateAppointment,
);

// DELETE /:id - Auth: Admin, Staff, or appointment owner (student)
appointmentsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkUser(Object.values(UserRole), Appointment),
  deleteAppointment,
);

export default appointmentsRoutes;
