import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Promotion, Speciality } from "src/models";

const excludedData: (keyof Attributes<Promotion>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedSpecialityData: (keyof Attributes<Speciality>)[] = [
  "createdAt",
  "updatedAt",
];

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

    res.status(200).json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const promotion = await Promotion.create(data);

    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.update(data);
    res.status(206).json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSpecialities = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { promotionId } = req.params;

    const specialities = await Speciality.findAll({
      where: { promotionId },
      attributes: {
        exclude: excludedSpecialityData,
      },
    });

    if (!specialities) {
      res.status(404).json({ message: "Specialities not found" });
      return;
    }

    res.status(200).json(specialities);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
