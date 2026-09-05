import type { Request, Response } from "express";
import { Organization } from "src/models";

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.findAll();

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const getOneOrganization = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const organization = await Organization.findOne({ where: { slug: slug } });

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const organization = await Organization.create(data);

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const data = req.body;

    const organization = await Organization.findOne({ where: { slug: slug } });
    if (!organization) {
      return res.status(404).json({ error: "Organisation non trouvée." });
    }
    const updatedOrganization = await Organization.update(data, {
      where: { slug: slug },
    });
    res.status(206).json(updatedOrganization);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const organization = await Organization.findOne({
      where: { slug: req.params.slug },
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
