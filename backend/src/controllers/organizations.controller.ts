import type { Request, Response } from "express";
import { Attributes } from "sequelize";
import { Campus, Media, Organization, User } from "src/models";

const excludedData: (keyof Attributes<Organization>)[] = [
  "createdAt",
  "updatedAt",
];

const excludedUserData: (keyof Attributes<User>)[] = [
  "password_hash",
  "createdAt",
  "updatedAt",
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
    res.status(500).json(error);
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
    res.status(500).json(error);
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const organization = await Organization.create(data);

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json(error);
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
      return res.status(404).json({ error: "Organisation not found." });
    }

    await organization.update(data);
    res.status(206).json({ message: "Organization updated" });
  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json({
      error: "Erreur serveur.",
    });
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
    console.error("GET ORGANIZATION CAMPUSES ERROR:", error);
    res.status(500).json(error);
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
      ],
    });

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
