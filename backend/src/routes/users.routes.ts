import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  login,
  updateUser,
} from "controllers/users.controller";
import express from "express";
import mediasRoutes from "routes/medias.routes";
import authenticateUser from "../../middlewares/auth.middleware";
import applicationsRoutes from "./applications.routes";

const usersRoutes = express.Router({ mergeParams: true });

// LOGIN
usersRoutes.post("/login", authenticateUser, login);

// GET
usersRoutes.get("/", authenticateUser, getAllUsers);
usersRoutes.get("/:id", authenticateUser, getOneUser);

// CREATE
usersRoutes.post("/", createUser);

// UPDATE
usersRoutes.patch("/:id", authenticateUser, updateUser);

// DELETE
usersRoutes.delete("/:id", authenticateUser, deleteUser);

// Medias routes
usersRoutes.use("/:userId/docs/media", authenticateUser, mediasRoutes);

// Applications routes
usersRoutes.use("/:userId/application", authenticateUser, applicationsRoutes);

export default usersRoutes;
