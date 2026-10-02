/* =========================
   RESSOURCE : APPLICATIONS
========================= */

import {
  createApplication,
  deleteApplication,
  getAppointments,
  getOneApplication,
  updateApplication,
} from "controllers/application.controller";

import express from "express";
import { Application } from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import { checkUser } from "../../middlewares/auth.middleware";

const applicationsRoutes = express.Router({ mergeParams: true });

applicationsRoutes.get("/:id", getOneApplication);

applicationsRoutes.post(
  "/",
  checkUser(Object.values(UserRole), Application),
  createApplication,
);

applicationsRoutes.patch(
  "/:id",
  checkUser(Object.values(UserRole), Application),
  updateApplication,
);

applicationsRoutes.delete(
  "/:id",
  checkUser(Object.values(UserRole), Application),
  deleteApplication,
);

applicationsRoutes.get("/:applicationId/appointments", getAppointments);

export default applicationsRoutes;
