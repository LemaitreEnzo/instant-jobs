import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { SubSpeciality } from "src/models";

const excludedData: (keyof Attributes<SubSpeciality>)[] = [
  "createdAt",
  "updatedAt",
];

export const getOneSubSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subSpeciality = await SubSpeciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!subSpeciality) {
      return res.status(404).json({ message: "Sub-speciality not found" });
    }

    return res.status(200).json(subSpeciality);
  } catch (error) {
    console.error("[getOneSubSpeciality] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubSpeciality = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const subSpeciality = await SubSpeciality.create(data);

    return res.status(201).json(subSpeciality);
  } catch (error) {
    console.error("[createSubSpeciality] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const subSpeciality = await SubSpeciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!subSpeciality) {
      return res.status(404).json({ message: "Sub-speciality not found" });
    }

    await subSpeciality.update(data);
    return res.status(200).json(subSpeciality);
  } catch (error) {
    console.error("[updateSubSpeciality] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subSpeciality = await SubSpeciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!subSpeciality) {
      return res.status(404).json({ message: "Sub-speciality not found" });
    }

    await subSpeciality.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error("[deleteSubSpeciality] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
