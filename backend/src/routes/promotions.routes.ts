import express from "express";
import {
  createPromotion,
  deletePromotion,
  getAllPromotions,
  getOnePromotion,
  updatePromotion,
} from "src/controllers/promotions.controller";
import specialitiesRoutes from "./specialities.routes";

const promotionsRoutes = express.Router({ mergeParams: true });

//GET
promotionsRoutes.get("/", getAllPromotions);
promotionsRoutes.get("/:slug", getOnePromotion);

//CREATE
promotionsRoutes.post("/", createPromotion);

//UPDATE
promotionsRoutes.patch("/:slug", updatePromotion);

//DELETE
promotionsRoutes.delete("/:slug", deletePromotion);

// SPECIALITIES ROUTES
promotionsRoutes.use("/:slug/speciality", specialitiesRoutes);

export default promotionsRoutes;
