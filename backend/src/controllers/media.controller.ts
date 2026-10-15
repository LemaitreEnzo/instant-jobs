/**
 * Media controller managing uploaded documents (CVs, cover letters, portfolio files)
 * and their database records.
 */
import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Media } from "src/models";

const excludedData: (keyof Attributes<Media>)[] = ["updatedAt"];

/**
 * Retrieves a single media record by primary ID.
 *
 * @param req - Express request with media ID in params.
 * @param res - Express response returning media (200), not found (404), or internal error (500).
 */
export const getOneMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await Media.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    return res.status(200).json(media);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new media record.
 *
 * @param req - Express request with media metadata and content payload in body.
 * @param res - Express response returning created media (201) or internal error (500).
 */
export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const media = await Media.create(data);

    return res.status(201).json(media);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing media record by primary ID.
 *
 * @param req - Express request with media ID in params and update payload in body.
 * @param res - Express response returning updated media (200), not found (404), or internal error (500).
 */
export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const media = await Media.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    await media.update(data);

    return res.status(200).json(media);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a media record by primary ID.
 *
 * @param req - Express request with media ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await Media.findOne({ where: { id } });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    await media.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
