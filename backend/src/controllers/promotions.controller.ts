import type { Request, Response } from "express";
import { Promotion } from "src/models";

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await Promotion.findAll();

    res.status(200);
    res.json(promotions);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const getOnePromotion = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const promotion = await Promotion.findOne({ where: { slug: slug } });

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
    const slug = req.params.slug;
    const data = req.body;
    const promotion = await Promotion.update(data, { where: { slug: slug } });

    res.status(206);
    res.json(promotion);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findOne({
      where: { slug: req.params.slug },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.destroy();

    res.status(204);
    res.json();
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};
