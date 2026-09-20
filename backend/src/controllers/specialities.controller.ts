import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Speciality, SubSpeciality } from "src/models";

const excludedData: (keyof Attributes<Speciality>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedSubSpecialityData: (keyof Attributes<SubSpeciality>)[] = [
  "createdAt",
  "updatedAt",
];

export const getOneSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const speciality = await Speciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    res.status(200).json(speciality);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.create(req.body);
    res.status(201).json(speciality);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const speciality = await Speciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    await speciality.update(data);
    res.status(206).json({ message: "Speciality updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const speciality = await Speciality.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    await speciality.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSubSpecialities = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { specialityId } = req.params;
    const subSpecialities = await SubSpeciality.findAll({
      where: { specialityId },
      attributes: {
        exclude: excludedSubSpecialityData,
      },
    });

    if (!subSpecialities) {
      res.status(404).json({ message: "Sub-specialities not found" });
      return;
    }

    res.status(200).json(subSpecialities);
  } catch (error) {
    res.status(500).json(error);
  }
};
