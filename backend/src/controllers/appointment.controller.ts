import { type Request, type Response } from "express";
import { Attributes } from "sequelize";
import { Appointment } from "src/models";

const excludedData: (keyof Attributes<Appointment>)[] = [
  "createdAt",
  "updatedAt",
];

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);
    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    return res.status(500).json({ message: "Internal server error" });
  }
};
