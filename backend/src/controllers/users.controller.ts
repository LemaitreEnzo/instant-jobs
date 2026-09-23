import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Attributes, Sequelize } from "sequelize";
import { Application, Media, User } from "src/models";
import { VALID_ROLES } from "../../middlewares/auth.middleware";
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
        // Strict role validation: reject unauthorized roles immediately (e.g., "staffie")
        if (!VALID_ROLES.includes(data.role as any)) {
          return res
            .status(403)
            .json({ message: "Forbidden: Unrecognized or unauthorized role" });
        }

        const secret = getEnv("SECRET");
        const payload = {
          id: data.id,
          uuid: data.uuid,
          role: data.role,
          organizationId: data.organizationId,
        };
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
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = getEnv("TOKEN");

    res.clearCookie(token, { path: "/" });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuth = async (req: Request, res: Response) => {
  try {
    const tokenName = getEnv("TOKEN");
    const secret = getEnv("SECRET");
    const token = req.cookies?.[tokenName];

    // Silent session check: if no token/session, return 200 with null cleanly without console errors
    if (!token) {
      return res.status(200).json(null);
    }

    let decoded: {
      id?: number;
      uuid: string;
      role: string;
      organizationId?: number;
    };

    try {
      decoded = jwt.verify(token, secret) as {
        id?: number;
        uuid: string;
        role: string;
        organizationId?: number;
      };
    } catch {
      // Expired or invalid token: silently return 200 with null
      return res.status(200).json(null);
    }

    // Validate role in token
    if (!VALID_ROLES.includes(decoded.role as any)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Unrecognized or unauthorized role" });
    }

    let user = null;

    // Priority lookup by UUID
    if (decoded.uuid) {
      user = await User.findOne({
        where: { uuid: decoded.uuid },
        attributes: { exclude: excludedData },
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
    }

    // Fallback lookup by ID
    if (!user && decoded.id) {
      user = await User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: excludedData },
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
    }

    if (!user) {
      return res.status(200).json(null);
    }

    // Validate user role in database
    if (!VALID_ROLES.includes(user.role as any)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Unrecognized or unauthorized role" });
    }

    const rawUserData: any = user.get({ plain: true });
    const { password_hash, createdAt, updatedAt, applications, ...userData } =
      rawUserData;

    if (userData.role === "student") {
      return res.status(200).json({
        ...userData,
        applications,
      });
    }

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await User.create(data);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(206).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit: number = parseInt(req.query.limit as string);

    const applications = await Application.findAll({
      where: { userId },
      limit: limit,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: excludedApplicationData,
      },
    });

    if (!applications) {
      return res.status(404).json({ message: "Applications not found" });
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};
