/**
 * Application controller managing internship and job search application records,
 * status transitions, and associated interview appointments.
 */
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

/**
 * Retrieves a single application by primary ID.
 *
 * @param req - Express request with application ID in params.
 * @param res - Express response returning the application (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new internship/job application record.
 *
 * @param req - Express request with application payload in body.
 * @param res - Express response returning created application (201) or internal error (500).
 */
export const createApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.create(req.body);

    return res.status(201).json(application);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing application by primary ID.
 *
 * @param req - Express request with application ID in params and update payload in body.
 * @param res - Express response returning updated application (200), not found (404), or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes an application by primary ID.
 *
 * @param req - Express request with application ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all scheduled appointments/interviews linked to a specific application.
 *
 * @param req - Express request with applicationId in params.
 * @param res - Express response returning array of appointments (200) or internal error (500).
 */
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
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
