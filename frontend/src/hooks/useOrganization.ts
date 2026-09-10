import type { Organization } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllOrganizations = async () => {
  try {
    const res = await fetch(`${BASE_URL}/organization/`);

    if (!res.ok) {
      throw new Error("Error retrieving organizations");
    }

    const data: Organization[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneOrganization = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/organization/${id}`);

    if (!res.ok) {
      throw new Error("Error retrieving the organization");
    }

    const data: Organization = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createOrganization = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateOrganization = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteOrganization = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/organization/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the organization");
    }

    console.log("Deleted organization");
  } catch (error) {
    console.error(error);
  }
};
