import express from "express";
import {
  createSubSpeciality,
  deleteSubSpeciality,
  getAllSubSpecialities,
  getOneSubSpeciality,
  updateSubSpeciality,
} from "src/controllers/subSpecialities.controller";

const subSpecialities = express.Router({ mergeParams: true });

//GET
subSpecialities.get("/", getAllSubSpecialities);
subSpecialities.get("/:slug", getOneSubSpeciality);

//CREATE
subSpecialities.post("/", createSubSpeciality);

//UPDATE
subSpecialities.patch("/:slug", updateSubSpeciality);

//DELETE
subSpecialities.delete("/:slug", deleteSubSpeciality);

export default subSpecialities;
