import type { Request, Response } from "express";
import { Campus } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllCampus = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const campus = await Campus.findAll({
      where: { organizationId },
      attributes: {
        exclude: excludedData,
      },
    });
    res.status(200);
    res.json(campus);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneCampus = async (req: Request, res: Response) => {
  try {
    const { organizationId, id } = req.params;

    const campus = await Campus.findOne({
      where: { organizationId, id },
      attributes: {
        exclude: excludedData,
      },
    });
    res.status(200);
    res.json(campus);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createCampus = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const campus = await Campus.create(data);
    res.status(201);
    res.json(campus);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateCampus = async (req: Request, res: Response) => {
  try {
    const { organizationId, id } = req.params;
    const data = req.body;
    const campus = await Campus.update(data, {
      where: { organizationId, id },
    });
    res.status(206);
    res.json(campus);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteCampus = async (req: Request, res: Response) => {
  try {
    const { organizationId, id } = req.params;
    const campus = await Campus.findOne({
      where: { organizationId, id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    await campus.destroy();
    res.status(204);
    res.json();
  } catch (error) {
    res.status(500).json(error);
  }
};
