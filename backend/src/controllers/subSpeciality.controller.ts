/**
 * SubSpeciality controller managing detailed curricular tracks and sub-specialisations.
 */
import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { SubSpeciality } from "src/models";

const excludedData: (keyof Attributes<SubSpeciality>)[] = [
  "createdAt",
  "updatedAt",
];

/**
 * Retrieves a single sub-speciality by primary ID.
 *
 * @param req - Express request with sub-speciality ID in params.
 * @param res - Express response returning sub-speciality (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new sub-speciality record.
 *
 * @param req - Express request with sub-speciality data in body.
 * @param res - Express response returning created sub-speciality (201) or internal error (500).
 */
export const createSubSpeciality = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const subSpeciality = await SubSpeciality.create(data);

    return res.status(201).json(subSpeciality);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing sub-speciality by primary ID.
 *
 * @param req - Express request with sub-speciality ID in params and update payload in body.
 * @param res - Express response returning updated sub-speciality (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a sub-speciality by primary ID.
 *
 * @param req - Express request with sub-speciality ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
