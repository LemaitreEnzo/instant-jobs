import type { Request, Response } from "express";
import { Promotion } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.params;

    const promotions = await Promotion.findAll({
      where: { campusId },
      attributes: {
        exclude: excludedData,
      }
    });

    if (!promotions) {
      return res.status(404).json({ message: "Promotions not found" });
    }

    res.status(200);
    res.json(promotions);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const getOnePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200);
    res.json(promotion);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const promotion = await Promotion.create(data);

    res.status(201);
    res.json(promotion);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const promotion = await Promotion.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found." });
    }

    promotion.update(data);
    res.status(206).json({ message: "Promotion updated"});
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findOne({
      where: { id },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.destroy();

    res.status(204).json({ message: "Promotion deleted" });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};
