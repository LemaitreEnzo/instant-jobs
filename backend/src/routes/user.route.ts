import { customRateLimiter } from "config/rate-limit";
import express from "express";
import {
  createUser,
  deleteUser,
  getApplications,
  getAppointmentsByUser,
  getAuth,
  getMedias,
  getOneUser,
  login,
  logout,
  updateUser,
} from "src/controllers/user.controller";
import { UserRole } from "src/models/enums/user.enum";
import { authenticateUser, checkUser } from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/role.middleware";

const usersRoutes = express.Router({ mergeParams: true });

usersRoutes.post(
  "/login",
  customRateLimiter({ time: 5, limit: 10, skipSuccessfulRequests: true }),
  login,
);

usersRoutes.post("/logout", logout);

usersRoutes.get("/me", getAuth);

usersRoutes.get("/:id", authenticateUser, getOneUser);

usersRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createUser,
);

usersRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  authenticateUser,
  checkUser(),
  updateUser,
);

usersRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteUser,
);

usersRoutes.get("/:userId/medias", authenticateUser, checkUser(), getMedias);

usersRoutes.get(
  "/:userId/applications",
  authenticateUser,
  checkUser(),
  getApplications,
);

usersRoutes.get(
  "/:userId/appointments",
  authenticateUser,
  checkUser(),
  getAppointmentsByUser,
);

export default usersRoutes;
