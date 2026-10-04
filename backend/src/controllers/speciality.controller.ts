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

    return res.status(200).json(speciality);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.create(req.body);
    return res.status(201).json(speciality);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(200).json(speciality);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubSpecialities = async (req: Request, res: Response) => {
  try {
    const { specialityId } = req.params;
    const subSpecialities = await SubSpeciality.findAll({
      where: { specialityId },
      attributes: {
        exclude: excludedSubSpecialityData,
      },
    });

    return res.status(200).json(subSpecialities);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
