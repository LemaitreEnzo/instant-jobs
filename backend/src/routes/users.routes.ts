import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "controllers/users.controller";
import express from "express";
import mediasRoutes from "routes/medias.routes";
import applicationsRoutes from "./applications.routes";

const usersRoutes = express.Router({ mergeParams: true });

// GET
usersRoutes.get("/", getAllUsers);
usersRoutes.get("/:id", getOneUser);

// CREATE
usersRoutes.post("/", createUser);

// UPDATE
usersRoutes.patch("/:id", updateUser);

// DELETE
usersRoutes.delete("/:id", deleteUser);

// Medias routes
usersRoutes.use("/:id/docs/media", mediasRoutes);

// Applications routes
usersRoutes.use("/:id/application", applicationsRoutes);

export default usersRoutes;
