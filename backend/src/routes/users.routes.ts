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

const usersRoutes = express.Router();

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
usersRoutes.use("/:id/docs/medias", mediasRoutes);

// Applications routes
usersRoutes.use("/:id/applications", applicationsRoutes);

export default usersRoutes;
