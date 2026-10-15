/**
 * User routing definitions.
 * Configures authentication endpoints, profile retrieval, user administration,
 * and student sub-resources with rate-limiting and ownership verification guards.
 */
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

// POST /login - Public: Authenticates credentials with brute-force protection (10 attempts / 5min)
usersRoutes.post(
  "/login",
  customRateLimiter({ time: 5, limit: 10, skipSuccessfulRequests: true }),
  login,
);

// POST /logout - Public/Auth: Clears the session cookie
usersRoutes.post("/logout", logout);

// GET /me - Public/Auth: Returns current authenticated session or null
usersRoutes.get("/me", getAuth);

// GET /:id - Auth: Any authenticated user
usersRoutes.get("/:id", authenticateUser, getOneUser);

// POST / - Auth: Admin, Staff
usersRoutes.post(
  "/",
  customRateLimiter({ limit: 10 }),
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createUser,
);

// PATCH /:id - Auth: Admin, Staff, or self-account owner
usersRoutes.patch(
  "/:id",
  customRateLimiter({ limit: 20 }),
  authenticateUser,
  checkUser(),
  updateUser,
);

// DELETE /:id - Auth: Admin, Staff
usersRoutes.delete(
  "/:id",
  customRateLimiter({ time: 5, limit: 5 }),
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteUser,
);

// GET /:userId/medias - Auth: Admin, Staff, or self-account owner
usersRoutes.get("/:userId/medias", authenticateUser, checkUser(), getMedias);

// GET /:userId/applications - Auth: Admin, Staff, or self-account owner
usersRoutes.get(
  "/:userId/applications",
  authenticateUser,
  checkUser(),
  getApplications,
);

// GET /:userId/appointments - Auth: Admin, Staff, or self-account owner
usersRoutes.get(
  "/:userId/appointments",
  authenticateUser,
  checkUser(),
  getAppointmentsByUser,
);

export default usersRoutes;
