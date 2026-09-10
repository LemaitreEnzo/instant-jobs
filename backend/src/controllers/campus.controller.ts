import type { Request, Response } from "express";
import { Campus, Organization } from "src/models";

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

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    res.status(200).json(campus);
  } catch (error) {
    console.error("GET ALL CAMPUS ERROR:", error);
    res.status(500).json(error);
  }
};

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

    res.status(200).json(campus);
  } catch (error) {
    console.error("GET ONE CAMPUS ERROR:", error);
    res.status(500).json({ error: String(error) });
  }
};

export const createCampus = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const campus = await Campus.create(data);
    res.status(201).json(campus);
  } catch (error) {
    console.error("CREATE CAMPUS ERROR:", error);
    res.status(500).json(error);
  }
};

export const updateCampus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const campus = await Campus.update(data, {
      where: { id },
    });
    res.status(206).json(campus);
  } catch (error) {
    console.error("UPDATE CAMPUS ERROR:", error);
    res.status(500).json(error);
  }
};

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
    res.status(204).json();
  } catch (error) {
    console.error("DELETE CAMPUS ERROR:", error);
    res.status(500).json(error);
  }
};
