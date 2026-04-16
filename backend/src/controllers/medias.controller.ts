import type { Request, Response } from "express";
import { Media } from "src/models/medias.model";

export const getAllMedias = async (req: Request, res: Response) => {
    try {
        const medias = await Media.findAll()

        res.status(200).json({ medias })
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur serveur."
        })
    }
};

export const getOneMedia = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const media = await Media.findOne({ where: { id: id } })
        if (!media) {
            return res.status(404).json({ error: "Media non trouvé." })
        }

        res.status(200).json({ media })
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur serveur."
        })
    }
};

export const createMedia = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const media = await Media.create(data)

        res.status(201).json({ media })
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur serveur."
        })
    }
};

export const updateMedia = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const media = await Media.findOne({ where: { id: id } })
        if (!media) {
            return res.status(404).json({ error: "Media non trouvé." })
        }
        const updatedMedia = await Media.update(data, { where: { id: id } })
        res.status(206).json(updatedMedia)
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur serveur."
        })
    }
};

export const deleteMedia = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const media = await Media.findOne({ where: { id: id } })
        if (!media) {
            return res.status(404).json({ error: "Media non trouvé." })
        }
        const deletedMedia = await Media.destroy({ where: { id: id } })
        res.status(204).json({ deletedMedia })
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur serveur."
        })
    }
};
