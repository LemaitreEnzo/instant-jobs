import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Media } from "src/models";

const excludedData: (keyof Attributes<Media>)[] = ["createdAt", "updatedAt"];

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const media = await Media.create(data);

    return res.status(201).json(media);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    return res.status(500).json({ message: "Internal server error" });
  }
};
