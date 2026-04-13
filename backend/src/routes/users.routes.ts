import { getAllUsers } from "controllers/users.controller";
import express from "express";

const usersRoutes = express.Router();

usersRoutes.get("/", getAllUsers);

export default usersRoutes;
