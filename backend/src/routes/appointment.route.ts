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

const appointmentsRoutes = express.Router({ mergeParams: true });

appointmentsRoutes.get("/:id", getOneAppointment);

appointmentsRoutes.post("/", createAppointment);

appointmentsRoutes.patch("/:id", updateAppointment);

appointmentsRoutes.delete("/:id", deleteAppointment);

export default appointmentsRoutes;
