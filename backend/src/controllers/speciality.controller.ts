/**
 * Speciality controller managing curriculum specialities
 * and their affiliated sub-specialities.
 */
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

/**
 * Retrieves a single speciality by primary ID.
 *
 * @param req - Express request with speciality ID in params.
 * @param res - Express response returning speciality (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new speciality record.
 *
 * @param req - Express request with speciality data in body.
 * @param res - Express response returning created speciality (201) or internal error (500).
 */
export const createSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await Speciality.create(req.body);

    return res.status(201).json(speciality);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing speciality by primary ID.
 *
 * @param req - Express request with speciality ID in params and update payload in body.
 * @param res - Express response returning updated speciality (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a speciality by primary ID.
 *
 * @param req - Express request with speciality ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all sub-specialities associated with a specific speciality.
 *
 * @param req - Express request with specialityId in params.
 * @param res - Express response returning array of sub-specialities (200) or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
