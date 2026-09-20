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

    res.status(200).json(subSpeciality);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createSubSpeciality = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const subSpeciality = await SubSpeciality.create(data);

    res.status(201).json({ subSpeciality });
  } catch (error) {
    res.status(500).json(error);
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
    res.status(206).json({ message: "Sub-speciality updated" });
  } catch (error) {
    res.status(500).json(error);
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
      return res.status(404).json({ message: "Sub speciality not found" });
    }

    await subSpeciality.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};
