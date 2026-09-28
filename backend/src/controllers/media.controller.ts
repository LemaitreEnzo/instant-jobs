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

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const media = await Media.create(data);

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(206).json(media);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
