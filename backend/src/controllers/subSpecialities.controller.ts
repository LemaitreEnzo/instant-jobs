import type { Request, Response } from "express";
import { SubSpeciality } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllSubSpecialities = async (req: Request, res: Response) => {
  try {
    const { specialityId } = req.params;
    const subSpecialities = await SubSpeciality.findAll({
      where: { specialityId },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!subSpecialities) {
      return res.status(404).json({ message: "Sub-specialities not found" });
    }

    res.status(200);
    res.json(subSpecialities);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

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

    res.status(200);
    res.json(subSpeciality);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const createSubSpeciality = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const subSpeciality = await SubSpeciality.create(data);

    res.status(201);
    res.json({ subSpeciality });
  } catch (error) {
    res.status(500);
    res.json(error);
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

    subSpeciality.update(data);
    res.status(206);
    res.json({ message: "Sub-speciality updated" });
  } catch (error) {
    res.status(500);
    res.json(error);
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

    res.status(204);
    res.json({ message: "Sub-speciality deleted" });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};
