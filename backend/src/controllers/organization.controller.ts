import type { Request, Response } from "express";
import { Attributes, Op, QueryTypes } from "sequelize";
import { sequelize } from "config/db";
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

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.findAll({
      attributes: {
        exclude: excludedData,
      },
    });

    if (!organizations) {
      return res.status(404).json({ message: "Organizations not found" });
    }

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const organization = await Organization.create(data);

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    res.status(206).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCampuses = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const campuses = await Campus.findAll({
      where: { organizationId },
      attributes: {
        exclude: excludedCampusData,
      },
    });

    if (!campuses) {
      return res.status(404).json({ message: "Campuses not found" });
    }

    res.status(200).json(campuses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    const users = await User.findAll({
      where: { organizationId },
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
    });

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicationStatistics = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;
    const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();
    const studentId = req.query.studentId ? parseInt(req.query.studentId as string, 10) : null;

    if (req.user?.organizationId !== Number(organizationId)) {
      return res.status(403).json({ message: "Forbidden: Access restricted to your organization" });
    }

    let studentCondition = "";
    const replacements: Record<string, any> = {
      organizationId: Number(organizationId),
      year,
    }

    if (studentId) {
      studentCondition = `AND u.id = :studentId`;
      replacements.studentId = studentId;
    }

    const query = `
    SELECT
        EXTRACT(MONTH FROM a."createdAt")::INTEGER AS month,
        COUNT(a.id)::INTEGER AS "organizationCount"
      FROM "Application" a
      INNER JOIN "User" u ON a."userId" = u.id
      WHERE u."organizationId" = :organizationId
        AND EXTRACT(YEAR FROM a."createdAt") = :year
        ${studentCondition}
      GROUP BY EXTRACT(MONTH FROM a."createdAt")
      ORDER BY month ASC;
    `;

    const rawStats: Array<{
      month: number;
      organizationCount: number;
    }> = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const statsMap = new Map<number, number>();
    rawStats.forEach((stat) => {
      statsMap.set(stat.month, stat.organizationCount);
    });

    const monthsData = monthNames.map((name, index) => {
      const monthNum = index + 1;

      return {
        month: name,
        monthIndex: monthNum,
        organizationCount: statsMap.get(monthNum) || 0,
      };
    });

    return res.status(200).json({
      year,
      organizationId: Number(organizationId),
      studentId: studentId ?? null,
      months: monthsData,
    });

  } catch (error) {
    console.error("Error fetching application stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
