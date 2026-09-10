import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "src/models";
import getEnv from "../../utils/envHelper";

const excludedData: string[] = ["password_hash", "createdAt", "updatedAt"];

export const login = async (req: Request, res: Response) => {
  try {
    // Get request's data for the token
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.findOne({
      where: { email: email },
    });

    //Check if a user with the email exist
    if (user) {
      const data = user?.dataValues;
      const passwordCheck = await bcrypt.compare(password, data.password_hash);

      if (passwordCheck) {
        const secret = getEnv("SECRET");
        const payload = { uuid: data.uuid, role: data.role };
        const jwtToken = jwt.sign(payload, secret);
        res.cookie(getEnv("TOKEN"), jwtToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json("Cookie created");
      } else {
        return res.status(401).json("Incorrect password");
      }
    } else {
      return res.status(401).json("No user found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const users = await User.findAll({
      where: { organizationId },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200);
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await User.create(data);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201);
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.update(data);
    res.status(206);
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(204);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
