/* =========================
   RESSOURCE : APPOINTMENTS
========================= */

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

appointmentsRoutes.get(
  "/:id",
  checkUser(Object.values(UserRole), Appointment),
  getOneAppointment,
);

appointmentsRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  checkUser(Object.values(UserRole), Appointment),
  createAppointment,
);

appointmentsRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  checkUser(Object.values(UserRole), Appointment),
  updateAppointment,
);

appointmentsRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  checkUser(Object.values(UserRole), Appointment),
  deleteAppointment,
);

export default appointmentsRoutes;
