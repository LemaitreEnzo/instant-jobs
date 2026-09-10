import type { Request, Response } from "express";
import { Speciality } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllSpecialities = async (req: Request, res: Response) => {
  try {
    const { promotionId } = req.params;

    const specialities = await Speciality.findAll({
      where: { promotionId },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!specialities) {
      return res.status(404).json({ message: "Specialities not found" });
    }

    res.status(200).json(specialities);
  } catch (error) {
    res.status(500).json(error);
  }
};

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

    speciality.update(data);

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
    res.status(204).json({ message: "Speciality deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
