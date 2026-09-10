import type { Request, Response } from "express";
import { Media } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllMedias = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const medias = await Media.findAll({
      where: { userId },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!medias) {
      return res.status(404).json({ message: "Medias not found" });
    }

    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json(error);
  }
};

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
      return res.status(404).json({ error: "Media non trouvé." });
    }

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const media = await Media.create(data);

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json(error);
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
      return res.status(404).json({ error: "Media not found." });
    }

    media.update(data);
    res.status(206).json({ message: "Media updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await Media.findOne({ where: { id } });

    if (!media) {
      return res.status(404).json({ error: "Media not found." });
    }

    await media.destroy();
    res.status(204).json({ message: "Media deleted"});
  } catch (error) {
    res.status(500).json(error);
  }
};
