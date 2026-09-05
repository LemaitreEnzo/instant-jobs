import type { Request, Response } from "express";
import { SubSpeciality } from "src/models";

export const getAllSubSpecialities = async (req: Request, res: Response) => {
  try {
    const subSpecialities = await SubSpeciality.findAll();

    res.status(200);
    res.json(subSpecialities);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const getOneSubSpeciality = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const subSpeciality = await SubSpeciality.findOne({
      where: { slug: slug },
    });

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
    const slug = req.params.slug;
    const data = req.body;
    const subSpeciality = await SubSpeciality.update(data, {
      where: { slug: slug },
    });

    res.status(206);
    res.json({ subSpeciality });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const deleteSubSpeciality = async (req: Request, res: Response) => {
  try {
    const subSpeciality = await SubSpeciality.findOne({
      where: { slug: req.params.slug },
    });

    if (!subSpeciality) {
      return res.status(404).json({ message: "Sub speciality not found" });
    }

    await subSpeciality.destroy();

    res.status(204);
    res.json();
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};
