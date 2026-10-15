/**
 * Promotion controller managing annual academic class cohorts (promotions)
 * and their affiliated training specialities.
 */
import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Promotion, Speciality } from "src/models";

const excludedData: (keyof Attributes<Promotion>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedSpecialityData: (keyof Attributes<Speciality>)[] = [
  "createdAt",
  "updatedAt",
];

/**
 * Retrieves a single promotion by primary ID.
 *
 * @param req - Express request with promotion ID in params.
 * @param res - Express response returning promotion (200), not found (404), or internal error (500).
 */
export const getOnePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.status(200).json(promotion);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new promotion record.
 *
 * @param req - Express request with promotion data in body.
 * @param res - Express response returning created promotion (201) or internal error (500).
 */
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const promotion = await Promotion.create(data);

    return res.status(201).json(promotion);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing promotion by primary ID.
 *
 * @param req - Express request with promotion ID in params and update payload in body.
 * @param res - Express response returning updated promotion (200), not found (404), or internal error (500).
 */
export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const promotion = await Promotion.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.update(data);

    return res.status(200).json(promotion);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a promotion by primary ID.
 *
 * @param req - Express request with promotion ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findOne({
      where: { id },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all specialities associated with a specific promotion.
 *
 * @param req - Express request with promotionId in params.
 * @param res - Express response returning array of specialities (200) or internal error (500).
 */
export const getSpecialities = async (req: Request, res: Response) => {
  try {
    const { promotionId } = req.params;

    const specialities = await Speciality.findAll({
      where: { promotionId },
      attributes: {
        exclude: excludedSpecialityData,
      },
    });

    return res.status(200).json(specialities);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
