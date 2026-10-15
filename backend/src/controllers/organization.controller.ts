/**
 * Organization controller managing school and company institutions,
 * their associated campuses, and affiliated members (students and staff).
 */
import type { Request, Response } from "express";
import { Attributes, Op } from "sequelize";
import {
  Campus,
  Media,
  Organization,
  Promotion,
  Speciality,
  SubSpeciality,
  User,
} from "src/models";

const excludedData: (keyof Attributes<Organization>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedUserData: (keyof Attributes<User>)[] = [
  "password_hash",
  "createdAt",
  "updatedAt",
  "campusId",
  "promotionId",
  "specialityId",
  "subSpecialityId",
];

const excludedMediaData: (keyof Attributes<Media>)[] = [
  "createdAt",
  "updatedAt",
  "userId",
];

const excludedCampusData: (keyof Attributes<Campus>)[] = [
  "createdAt",
  "updatedAt",
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
 * Retrieves all registered organizations (schools and companies).
 *
 * @param req - Express request.
 * @param res - Express response returning array of organizations (200) or internal error (500).
 */
export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.findAll({
      attributes: {
        exclude: excludedData,
      },
    });

    return res.status(200).json(organizations);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves a single organization by primary ID.
 *
 * @param req - Express request with organization ID in params.
 * @param res - Express response returning organization (200), not found (404), or internal error (500).
 */
export const getOneOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.status(200).json(organization);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates a new organization record.
 *
 * @param req - Express request with organization data in body.
 * @param res - Express response returning created organization (201) or internal error (500).
 */
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const organization = await Organization.create(data);

    return res.status(201).json(organization);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing organization by primary ID.
 *
 * @param req - Express request with organization ID in params and update payload in body.
 * @param res - Express response returning updated organization (200), not found (404), or internal error (500).
 */
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const organization = await Organization.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await organization.update(data);

    return res.status(200).json(organization);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes an organization by primary ID.
 *
 * @param req - Express request with organization ID in params.
 * @param res - Express response returning 204 on success, 404 if not found, or 500 on internal error.
 */
export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findOne({
      where: { id },
      attributes: {
        exclude: excludedData,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    await organization.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all campuses belonging to an organization.
 *
 * @param req - Express request with organizationId in params.
 * @param res - Express response returning array of campuses (200) or internal error (500).
 */
export const getCampuses = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const campuses = await Campus.findAll({
      where: { organizationId },
      attributes: {
        exclude: excludedCampusData,
      },
    });

    return res.status(200).json(campuses);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves all affiliated users of an organization.
 * Executes parallel queries to fetch students (with full academic relations)
 * and staff/admins, returning a unified member list.
 *
 * @param req - Express request with organizationId in params.
 * @param res - Express response returning array of users (200) or internal error (500).
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const [students, otherUsers] = await Promise.all([
      User.findAll({
        where: { organizationId, role: "student" },
        attributes: { exclude: excludedUserData },
        include: [
          {
            model: Media,
            as: "medias",
            required: false,
            attributes: { exclude: excludedMediaData },
          },
          {
            model: Campus,
            as: "campus",
            required: false,
            attributes: { exclude: [...excludedCampusData, "organizationId"] },
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
      }),

      User.findAll({
        where: {
          organizationId,
          role: { [Op.ne]: "student" },
        },
        attributes: { exclude: excludedUserData },
        include: [
          {
            model: Media,
            as: "medias",
            required: false,
            attributes: { exclude: excludedMediaData },
          },
          {
            model: Campus,
            as: "campus",
            required: false,
            attributes: { exclude: [...excludedCampusData, "organizationId"] },
          },
        ],
      }),
    ]);

    const users: User[] = [...students, ...otherUsers];

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
