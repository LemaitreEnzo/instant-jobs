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
subSpecialities.get("/:id", getOneSubSpeciality);

//CREATE
subSpecialities.post("/", createSubSpeciality);

//UPDATE
subSpecialities.patch("/:id", updateSubSpeciality);

//DELETE
subSpecialities.delete("/:id", deleteSubSpeciality);

export default subSpecialities;
