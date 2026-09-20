import {
  createUser,
  deleteUser,
  getAuthToken,
  getOneUser,
  getApplications,
  getMedias,
  login,
  logout,
  updateUser,
} from "controllers/users.controller";
import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";

const usersRoutes = express.Router({ mergeParams: true });

usersRoutes.post("/login", login);

usersRoutes.post("/logout", logout);

usersRoutes.get("/me", getAuthToken);

usersRoutes.get("/:id", authenticateUser, getOneUser);

usersRoutes.post("/", createUser);

usersRoutes.patch("/:id", authenticateUser, updateUser);

usersRoutes.delete("/:id", authenticateUser, deleteUser);

usersRoutes.get("/:userId/medias", authenticateUser, getMedias);

usersRoutes.get("/:userId/applications", authenticateUser, getApplications);

export default usersRoutes;
