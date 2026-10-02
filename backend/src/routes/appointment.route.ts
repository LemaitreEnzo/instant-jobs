/* =========================
   RESSOURCE : APPOINTMENTS
========================= */

import {
  createAppointment,
  deleteAppointment,
  getOneAppointment,
  updateAppointment,
} from "controllers/appointment.controller";

import express from "express";
import { Appointment } from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import { checkUser } from "../../middlewares/auth.middleware";

const appointmentsRoutes = express.Router({ mergeParams: true });

appointmentsRoutes.get("/:id", getOneAppointment);

appointmentsRoutes.post(
  "/",
  checkUser(Object.values(UserRole), Appointment),
  createAppointment,
);

appointmentsRoutes.patch(
  "/:id",
  checkUser(Object.values(UserRole), Appointment),
  updateAppointment,
);

appointmentsRoutes.delete(
  "/:id",
  checkUser(Object.values(UserRole), Appointment),
  deleteAppointment,
);

export default appointmentsRoutes;
