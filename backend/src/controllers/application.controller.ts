import { type Request, type Response } from "express";
import { Application } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;

    const applications = await Application.findAll({
      where: { userId },
      attributes: {
        exclude: excludedData,
      },
    });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneApplication = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const application = await Application.findOne({
      where: { userId, id },
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
    const { userId, id } = req.params;
    const application = await Application.findOne({
      where: { userId, id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const applicationUpdated = await Application.update(req.body, {
      where: { userId, id },
    });

    res.status(206).json(applicationUpdated);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const application = await Application.findOne({
      where: { userId, id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
};
