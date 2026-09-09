import type { Request, Response } from "express";
import { Organization } from "src/models";

const excludedData: string[] = ["createdAt", "updatedAt"];

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.findAll({
      attributes: {
        exclude: excludedData,
      },
    });

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

    const organization = await Organization.findOne({ where: { id } });
    if (!organization) {
      return res.status(404).json({ error: "Organisation not found." });
    }
    const updatedOrganization = await Organization.update(data, {
      where: { id },
    });
    res.status(206).json(updatedOrganization);
  } catch (error) {
    res.status(500);
    res.json(error);
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
    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};
