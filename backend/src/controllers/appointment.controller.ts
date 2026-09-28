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

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(206).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
