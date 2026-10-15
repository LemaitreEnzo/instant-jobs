/**
 * User controller managing authentication sessions, profile access,
 * CRUD operations, and associated student resources (applications, medias, appointments).
 */
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Attributes } from "sequelize";
import {
  Application,
  Appointment,
  Campus,
  Media,
  Promotion,
  Speciality,
  SubSpeciality,
  User,
} from "src/models";
import { UserRole } from "src/models/enums/user.enum";
import getEnv from "../../utils/envHelper";

const excludedData: (keyof Attributes<User>)[] = [
  "password_hash",
  "createdAt",
  "updatedAt",
  "campusId",
  "promotionId",
  "specialityId",
  "subSpecialityId",
];

const excludedMediaData: (keyof Attributes<Media>)[] = ["updatedAt", "userId"];

const excludedApplicationData: (keyof Attributes<Application>)[] = [
  "createdAt",
  "updatedAt",
  "userId",
];

const excludedAppointmentData: (keyof Attributes<Appointment>)[] = [
  "createdAt",
  "updatedAt",
  "userId",
];

const excludedCampusData: (keyof Attributes<Campus>)[] = [
  "createdAt",
  "updatedAt",
  "organizationId",
];
const excludedPromotionData: (keyof Attributes<Promotion>)[] = [
  "createdAt",
  "updatedAt",
  "campusId",
];
const excludedSpecialityData: (keyof Attributes<Speciality>)[] = [
  "createdAt",
  "updatedAt",
  "promotionId",
];
const excludedSubSpecialityData: (keyof Attributes<SubSpeciality>)[] = [
  "createdAt",
  "updatedAt",
  "specialityId",
];

/**
 * Authenticates user credentials, issues a signed JWT within an HTTP-Only cookie,
 * and returns the authenticated user data pruned of sensitive fields.
 *
 * @param req - Express request containing email and password in body.
 * @param res - Express response returning user data (200), invalid credentials (401),
 *              unauthorized role (403), or internal error (500).
 */
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
          attributes: { exclude: excludedApplicationData },
        },
        {
          model: Appointment,
          as: "appointments",
          required: false,
          attributes: { exclude: excludedAppointmentData },
        },
        {
          model: Campus,
          as: "campus",
          required: false,
          attributes: { exclude: excludedCampusData },
        },
        {
          model: Promotion,
          as: "promotion",
          required: false,
          attributes: { exclude: excludedPromotionData },
        },
        {
          model: Speciality,
          as: "speciality",
          required: false,
          attributes: { exclude: excludedSpecialityData },
        },
        {
          model: SubSpeciality,
          as: "subSpeciality",
          required: false,
          attributes: { exclude: excludedSubSpecialityData },
        },
      ],
    });

    if (user) {
      const data = user?.dataValues;
      const passwordCheck = await bcrypt.compare(password, data.password_hash);

      if (passwordCheck) {
        // Strict role validation: reject unauthorized roles immediately (e.g., "staffie")
        if (!Object.values(UserRole).includes(data.role)) {
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
          httpOnly: true, // inaccessible to JavaScript
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          sameSite: "strict", // protects against CSRF
          maxAge: 24 * 60 * 60 * 1000, // 24h
          path: "/",
        });

        const rawUserData: any = user.get({ plain: true });

        if (rawUserData.role !== "student") {
          delete rawUserData.applications;
          delete rawUserData.appointments;
          delete rawUserData.promotion;
          delete rawUserData.speciality;
          delete rawUserData.subSpeciality;
        }

        excludedData.forEach((key) => {
          delete rawUserData[key];
        });

        return res.status(200).json(rawUserData);
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Clears the authentication session cookie and logs the user out.
 *
 * @param req - Express request.
 * @param res - Express response returning 200 on success or 500 on failure.
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const token = getEnv("TOKEN");

    res.clearCookie(token, { path: "/" });

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves the currently authenticated user's session profile (/me).
 * Returns null silently if no session cookie exists. Excludes sensitive attributes
 * and prunes role-specific collections for non-students.
 *
 * @param req - Express request containing the session cookie.
 * @param res - Express response returning user profile or null (200),
 *              unauthorized error (401), forbidden role (403), or internal error (500).
 */
export const getAuth = async (req: Request, res: Response) => {
  try {
    const tokenName = getEnv("TOKEN");
    const secret = getEnv("SECRET");
    const token = req.cookies?.[tokenName];

    // Silent session check: if no token/session, 200 with null cleanly without console errors
    if (!token) {
      return res.status(200).json(null);
    }

    let decoded: {
      id?: number;
      uuid: string;
      role: UserRole;
      organizationId?: number;
    };

    try {
      decoded = jwt.verify(token, secret) as {
        id?: number;
        uuid: string;
        role: UserRole;
        organizationId?: number;
      };
    } catch {
      // Expired or invalid token: silently 200 with null
      return res.status(200).json(null);
    }

    // Validate role in token
    if (!Object.values(UserRole).includes(decoded.role)) {
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
            attributes: { exclude: excludedApplicationData },
          },
          {
            model: Appointment,
            as: "appointments",
            required: false,
            attributes: { exclude: excludedAppointmentData },
          },
          {
            model: Campus,
            as: "campus",
            required: false,
            attributes: { exclude: excludedCampusData },
          },
          {
            model: Promotion,
            as: "promotion",
            required: false,
            attributes: { exclude: excludedPromotionData },
          },
          {
            model: Speciality,
            as: "speciality",
            required: false,
            attributes: { exclude: excludedSpecialityData },
          },
          {
            model: SubSpeciality,
            as: "subSpeciality",
            required: false,
            attributes: { exclude: excludedSubSpecialityData },
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
            attributes: { exclude: excludedApplicationData },
          },
          {
            model: Appointment,
            as: "appointments",
            required: false,
            attributes: { exclude: excludedAppointmentData },
          },
          {
            model: Campus,
            as: "campus",
            required: false,
            attributes: { exclude: excludedCampusData },
          },
          {
            model: Promotion,
            as: "promotion",
            required: false,
            attributes: { exclude: excludedPromotionData },
          },
          {
            model: Speciality,
            as: "speciality",
            required: false,
            attributes: { exclude: excludedSpecialityData },
          },
          {
            model: SubSpeciality,
            as: "subSpeciality",
            required: false,
            attributes: { exclude: excludedSubSpecialityData },
          },
        ],
      });
    }

    if (!user) {
      return res.status(200).json(null);
    }

    // Validate user role in database
    if (!Object.values(UserRole).includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Unrecognized or unauthorized role" });
    }

    const rawUserData: any = user.get({ plain: true });

    if (rawUserData.role !== "student") {
      delete rawUserData.applications;
      delete rawUserData.appointments;
      delete rawUserData.promotion;
      delete rawUserData.speciality;
      delete rawUserData.subSpeciality;

      if (rawUserData.role === "admin") {
        delete rawUserData.campus;
      }
    }

    return res.status(200).json(rawUserData);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves a single user by primary ID along with related relations
 * (medias, applications, appointments, campus, promotion, speciality, subSpeciality),
 * filtering sensitive attributes and associations based on user role.
 *
 * @param req - Express request with user ID in params.
 * @param res - Express response returning user details (200), not found (404), or internal error (500).
 */
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
          attributes: { exclude: excludedApplicationData },
        },
        {
          model: Appointment,
          as: "appointments",
          required: false,
          attributes: { exclude: excludedAppointmentData },
        },
        {
          model: Campus,
          as: "campus",
          required: false,
          attributes: { exclude: excludedCampusData },
        },
        {
          model: Promotion,
          as: "promotion",
          required: false,
          attributes: { exclude: excludedPromotionData },
        },
        {
          model: Speciality,
          as: "speciality",
          required: false,
          attributes: { exclude: excludedSpecialityData },
        },
        {
          model: SubSpeciality,
          as: "subSpeciality",
          required: false,
          attributes: { exclude: excludedSubSpecialityData },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rawUserData: any = user.get({ plain: true });

    if (rawUserData.role !== "student") {
      delete rawUserData.applications;
      delete rawUserData.appointments;
      delete rawUserData.promotion;
      delete rawUserData.speciality;
      delete rawUserData.subSpeciality;
    }

    return res.status(200).json(rawUserData);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new user with bcrypt-hashed password.
 * Returns the created user object without password_hash or timestamps.
 *
 * @param req - Express request containing user fields in body.
 * @param res - Express response returning created user (201) or internal error (500).
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userData = {
      ...data,
      password_hash: hashedPassword,
    };
    const user = await User.create(userData);

    const rawUserData: any = user.get({ plain: true });

    delete rawUserData.password_hash;
    delete rawUserData.createdAt;
    delete rawUserData.updatedAt;

    return res.status(201).json(rawUserData);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing user by primary ID.
 *
 * @param req - Express request with user ID in params and update payload in body.
 * @param res - Express response returning updated user (200), not found (404), or internal error (500).
 */
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

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a user account by primary ID.
 *
 * @param req - Express request with user ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
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

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all internship/job applications for a specific student.
 *
 * @param req - Express request with student userId in params.
 * @param res - Express response returning array of applications (200) or internal error (500).
 */
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const applications = await Application.findAll({
      where: { userId },
      attributes: {
        exclude: excludedApplicationData,
      },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all media documents (CVs, cover letters) uploaded by a specific user.
 *
 * @param req - Express request with userId in params.
 * @param res - Express response returning array of media records (200) or internal error (500).
 */
export const getMedias = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const medias = await Media.findAll({
      where: { userId },
      attributes: {
        exclude: excludedMediaData,
      },
    });

    return res.status(200).json(medias);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all scheduled appointments/interviews for a specific student.
 *
 * @param req - Express request with student userId in params.
 * @param res - Express response returning array of appointments (200) or internal error (500).
 */
export const getAppointmentsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.findAll({
      where: { userId },
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
