import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
  login,
} from "controllers/users.controller";
import express from "express";
import mediasRoutes from "routes/medias.routes";
import applicationsRoutes from "./applications.routes";

const usersRoutes = express.Router({ mergeParams: true });

// LOGIN
usersRoutes.post("/login", login);

// GET
usersRoutes.get("/", getAllUsers);
usersRoutes.get("/:id", getOneUser);

// CREATE
usersRoutes.post("/", createUser);
usersRoutes.post("/login", login);

// UPDATE
usersRoutes.patch("/:id", updateUser);

// DELETE
usersRoutes.delete("/:id", deleteUser);

// Medias routes
usersRoutes.use("/:id/docs/media", mediasRoutes);

// Applications routes
usersRoutes.use("/:id/application", applicationsRoutes);

export default usersRoutes;
