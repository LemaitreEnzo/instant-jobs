import { type Request, type Response } from "express";
import { Attributes } from "sequelize";
import { Application, Appointment } from "src/models";

const excludedData: (keyof Attributes<Application>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedAppointmentData: (keyof Attributes<Appointment>)[] = [
  "createdAt",
  "updatedAt",
  "applicationId",
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

    return res.status(200).json(application);
  } catch (error) {
    console.error("[getOneApplication] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.create(req.body);
    return res.status(201).json(application);
  } catch (error) {
    console.error("[createApplication] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(200).json(application);
  } catch (error) {
    console.error("[updateApplication] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(204).end();
  } catch (error) {
    console.error("[deleteApplication] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppointmentsByApplication = async (
  req: Request,
  res: Response,
) => {
  try {
    const { applicationId } = req.params;

    const appointments = await Appointment.findAll({
      where: { applicationId },
      attributes: {
        exclude: excludedAppointmentData,
      },
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("[getAppointmentsByApplication] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
