import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Campus, Promotion } from "src/models";

const excludedData: (keyof Attributes<Campus>)[] = ["createdAt", "updatedAt"];
const excludedPromotionData: (keyof Attributes<Promotion>)[] = [
  "createdAt",
  "updatedAt",
];

export const getOneCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    res.status(200).json(campus);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCampus = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const campus = await Campus.create(data);
    res.status(201).json(campus);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    await campus.update(data);
    res.status(206).json(campus);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    await campus.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.params;

    const promotions = await Promotion.findAll({
      where: { campusId },
      attributes: {
        exclude: excludedPromotionData,
      },
    });

    if (!promotions) {
      return res.status(404).json({ message: "Promotions not found" });
    }

    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
