import type { Request, Response } from "express";
import { Promotion } from "src/models/promotions.model";

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findAll();

    res.status(200);
    res.json({ promotion });
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
    res.json({ promotion });
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
    res.json({ promotion });
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
    res.json({ promotion });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const promotion = await Promotion.destroy({ where: { slug: slug } });

    res.status(204);
    res.json();
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};
