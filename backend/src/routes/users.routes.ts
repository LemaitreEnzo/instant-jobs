import {
  createUser,
  deleteUser,
  getOneUser,
  login,
  updateUser,
} from "controllers/users.controller";
import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";
import { getAllApplications } from "src/controllers/application.controller";
import { getAllMedias } from "src/controllers/medias.controller";

const usersRoutes = express.Router({ mergeParams: true });

usersRoutes.post("/login", authenticateUser, login);

usersRoutes.get("/:id", authenticateUser, getOneUser);

usersRoutes.post("/", createUser);

usersRoutes.patch("/:id", authenticateUser, updateUser);

usersRoutes.delete("/:id", authenticateUser, deleteUser);

usersRoutes.get("/:userId/medias", authenticateUser, getAllMedias);

usersRoutes.get("/:userId/applications", authenticateUser, getAllApplications);

export default usersRoutes;
