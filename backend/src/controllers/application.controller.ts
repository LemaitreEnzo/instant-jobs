import { type Request, type Response } from "express";
import { Attributes } from "sequelize";
import { Application } from "src/models";

const excludedData: (keyof Attributes<Application>)[] = [
  "createdAt",
  "updatedAt",
];

export const getOneApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const application = await Application.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.update(data);
    res.status(206).json({ message: "Application updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};
