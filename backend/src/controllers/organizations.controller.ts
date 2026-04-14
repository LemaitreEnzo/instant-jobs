import type { Request, Response } from "express";
import { Organization } from "models/organizations.model";

export const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await Organization.findAll();
        res.status(200).json({ organizations });
    } catch (error) {
        res.status(500).json(error);
    }
}