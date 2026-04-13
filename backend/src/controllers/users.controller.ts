import type { Request, Response } from "express";
import { UserModel } from "models/users.model";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.findAll();
  res.json({ users });
};
