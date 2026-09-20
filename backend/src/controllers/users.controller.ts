import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Attributes, Sequelize } from "sequelize";
import { Application, Media, User } from "src/models";
import getEnv from "../../utils/envHelper";

const excludedData: (keyof Attributes<User>)[] = [
  "password_hash",
  "createdAt",
  "updatedAt",
];
const excludedMediaData: (keyof Attributes<Media>)[] = [
  "createdAt",
  "updatedAt",
  "userId",
];
const excludedApplicationData: (keyof Attributes<Application>)[] = [
  "createdAt",
  "updatedAt",
  "userId",
];

export const login = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.findOne({
      where: { email: email },
      include: [
        {
          model: Media,
          as: "medias",
          required: false,
          attributes: { exclude: excludedMediaData },
        },
        {
          model: Application,
          as: "applications",
          required: false,
          where: Sequelize.literal(`"User"."role" = 'student'`),
          attributes: { exclude: excludedApplicationData },
        },
      ],
    });

    if (user) {
      const data = user?.dataValues;
      const passwordCheck = await bcrypt.compare(password, data.password_hash);

      if (passwordCheck) {
        const secret = getEnv("SECRET");
        const payload = { uuid: data.uuid, role: data.role };
        const jwtToken = jwt.sign(payload, secret);
        res.cookie(getEnv("TOKEN"), jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
        });

        const rawUserData: any = user.get({ plain: true });

        const {
          password_hash,
          createdAt,
          updatedAt,
          applications,
          ...userData
        } = rawUserData;

        if (userData.role === "student") {
          return res.status(200).json({
            ...userData,
            applications,
          });
        }

        return res.status(200).json(userData);
      } else {
        return res.status(401).json("Incorrect credentials");
      }
    } else {
      return res.status(401).json("No user found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = getEnv("TOKEN");

    res.clearCookie(token, { path: "/" });
    res.status(200).json("Successfully logged out");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAuthToken = async (req: Request, res: Response) => {
  try {
    const token = getEnv("TOKEN");
    if (!req.cookies[token]) res.status(404).json(null);

    res.status(200).json(req.cookies[token]);
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
      include: [
        {
          model: Media,
          as: "medias",
          required: false,
          attributes: { exclude: excludedMediaData },
        },
        {
          model: Application,
          as: "applications",
          required: false,
          where: Sequelize.literal(`"User"."role" = 'student'`),
          attributes: { exclude: excludedApplicationData },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rawUserData: any = user.get({ plain: true });

    const { password_hash, createdAt, updatedAt, applications, ...userData } =
      rawUserData;

    if (userData.role === "student") {
      res.status(200).json({
        ...userData,
        applications,
      });
    }

    res.status(200).json(userData);
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

    await user.update(data);
    res.status(206).json({ message: "User updated" });
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
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const applications = await Application.findAll({
      where: { userId },
      attributes: {
        exclude: excludedApplicationData,
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

export const getMedias = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const medias = await Media.findAll({
      where: { userId },
      attributes: {
        exclude: excludedMediaData,
      },
    });

    if (!medias) {
      return res.status(404).json({ message: "Medias not found" });
    }

    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json(error);
  }
};
