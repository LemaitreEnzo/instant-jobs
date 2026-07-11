import type { Request, Response } from "express";
import { Speciality } from "models/specialities.model";

export const getAllSpecialities = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.findAll();
    res.status(200).json({ speciality });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.findOne({
      where: { slug: req.params.slug },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    res.status(200).json({ speciality });
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
    const speciality = await Speciality.findOne({
      where: { slug: req.params.slug },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    const specialityUpdated = await Speciality.update(req.body, {
      where: { slug: req.params.slug },
    });

    res.status(206).json({ specialityUpdated });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.findOne({
      where: { slug: req.params.slug },
    });

    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    await Speciality.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
};
