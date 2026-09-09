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
promotionsRoutes.get("/:id", getOnePromotion);

//CREATE
promotionsRoutes.post("/", createPromotion);

//UPDATE
promotionsRoutes.patch("/:id", updatePromotion);

//DELETE
promotionsRoutes.delete("/:id", deletePromotion);

// SPECIALITIES ROUTES
promotionsRoutes.use("/:promotionId/speciality", specialitiesRoutes);

export default promotionsRoutes;
