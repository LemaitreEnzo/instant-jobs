import express from "express";
import {
  createUser,
  deleteUser,
  getApplications,
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

usersRoutes.post("/login", login);

usersRoutes.post("/logout", logout);

usersRoutes.get("/me", getAuth);

usersRoutes.get("/:id", authenticateUser, getOneUser);

usersRoutes.post(
  "/",
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  createUser,
);

usersRoutes.patch("/:id", authenticateUser, checkUser(), updateUser);

usersRoutes.delete(
  "/:id",
  authenticateUser,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  deleteUser,
);

usersRoutes.get("/:userId/medias", authenticateUser, getMedias);

usersRoutes.get("/:userId/applications", authenticateUser, getApplications);

export default usersRoutes;
