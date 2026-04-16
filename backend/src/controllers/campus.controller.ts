import type { Request, Response } from "express";
import { Campus } from "src/models/campus.model";

export const getAllCampus = async (req: Request, res: Response) => {
    try {
            const campus = await Campus.findAll();
            res.status(200);
            res.json({campus});
        } catch (error) {
            res.status(500).json(error);
        }
};

export const getOneCampus = async (req: Request, res: Response) => {
    try {
            const {slug} = req.params;
            const campus = await Campus.findOne({where: {slug: slug}});
            res.status(200);
            res.json({campus});
        } catch (error) {
            res.status(500).json(error);
        }
};

export const createCampus = async (req: Request, res: Response) => {
    try {
            const data = req.body;
            const campus = await Campus.create(data);  
            res.status(201);
            res.json({campus});
        } catch (error) {
            res.status(500).json(error);
        }
};

export const updateCampus = async (req: Request, res: Response) => {
    try {
            const data = req.body;
            const campus = await Campus.update(data, {where: {slug: req.params.slug}});
            res.status(206);
            res.json({campus});
        } catch (error) {
            res.status(500).json(error);
        }
};

export const deleteCampus = async (req: Request, res: Response) => {
    try {
            const campus = await Campus.destroy({where: {slug: req.params.slug}});
            res.status(204);
            res.json();
        } catch (error) {
            res.status(500).json(error);
        }
};
