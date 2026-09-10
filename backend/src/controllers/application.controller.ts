import { type Request, type Response } from "express";
import { Application } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const applications = await Application.findAll({
      where: { userId },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!applications) {
      return res.status(404).json({ message: "Applications not found" });
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      where: { id },
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

    application.update(data);
    res.status(206).json({ message: "Application updated"});
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
    res.status(204).json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
