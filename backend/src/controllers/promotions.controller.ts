import type { Request, Response } from "express";
import { Campus, Organization, Promotion } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.params;

    const promotions = await Promotion.findAll({
      where: { campusId },
      attributes: {
        exclude: excludedData,
      },
      include: [
        {
          model: Campus,
          required: true,
          attributes: [],
          include: [
            {
              model: Organization,
              attributes: ["id"],
            },
          ],
        },
      ],
    });

    res.status(200);
    res.json(promotions);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const getOnePromotion = async (req: Request, res: Response) => {
  try {
    const { campusId, id } = req.params;
    const promotion = await Promotion.findOne({
      where: { campusId, id },
      attributes: {
        exclude: excludedData,
      },
    });

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
    const { campusId, id } = req.params;

    const data = req.body;
    const promotion = await Promotion.update(data, {
      where: { campusId, id },
    });

    res.status(206);
    res.json(promotion);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { campusId, id } = req.params;
    const promotion = await Promotion.findOne({
      where: { campusId, id },
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
