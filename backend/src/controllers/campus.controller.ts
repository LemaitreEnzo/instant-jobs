/**
 * Campus controller managing geographic training locations (campuses)
 * and their affiliated student promotions.
 */
import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Campus, Promotion } from "src/models";

const excludedData: (keyof Attributes<Campus>)[] = ["createdAt", "updatedAt"];
const excludedPromotionData: (keyof Attributes<Promotion>)[] = [
  "createdAt",
  "updatedAt",
];

/**
 * Retrieves a single campus by primary ID.
 *
 * @param req - Express request with campus ID in params.
 * @param res - Express response returning campus (200), not found (404), or internal error (500).
 */
export const getOneCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    return res.status(200).json(campus);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new campus record.
 *
 * @param req - Express request with campus data in body.
 * @param res - Express response returning created campus (201) or internal error (500).
 */
export const createCampus = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const campus = await Campus.create(data);

    return res.status(201).json(campus);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing campus by primary ID.
 *
 * @param req - Express request with campus ID in params and update payload in body.
 * @param res - Express response returning updated campus (200), not found (404), or internal error (500).
 */
export const updateCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    await campus.update(data);

    return res.status(200).json(campus);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a campus by primary ID.
 *
 * @param req - Express request with campus ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
export const deleteCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    await campus.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all promotions affiliated with a specific campus.
 *
 * @param req - Express request with campusId in params.
 * @param res - Express response returning array of promotions (200) or internal error (500).
 */
export const getPromotions = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.params;

    const promotions = await Promotion.findAll({
      where: { campusId },
      attributes: {
        exclude: excludedPromotionData,
      },
    });

    return res.status(200).json(promotions);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
