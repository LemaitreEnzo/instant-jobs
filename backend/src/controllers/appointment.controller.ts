/**
 * Appointment controller managing recruitment interview schedules,
 * appointment status, and associated student meeting dates.
 */
import { type Request, type Response } from "express";
import { Attributes } from "sequelize";
import { Appointment } from "src/models";

const excludedData: (keyof Attributes<Appointment>)[] = [
  "createdAt",
  "updatedAt",
];

/**
 * Retrieves a single appointment by primary ID.
 *
 * @param req - Express request with appointment ID in params.
 * @param res - Express response returning appointment (200), not found (404), or internal error (500).
 */
export const getOneAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new appointment record.
 *
 * @param req - Express request with appointment payload in body.
 * @param res - Express response returning created appointment (201) or internal error (500).
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);

    return res.status(201).json(appointment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing appointment by primary ID.
 *
 * @param req - Express request with appointment ID in params and update payload in body.
 * @param res - Express response returning updated appointment (200), not found (404), or internal error (500).
 */
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const appointment = await Appointment.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.update(data);

    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes an appointment by primary ID.
 *
 * @param req - Express request with appointment ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
