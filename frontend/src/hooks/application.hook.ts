import type { Application } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllApplications = async (
  organizationid: string,
  userId: number,
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/users/${userId}/application`,
    );

    if (!res.ok) {
      throw new Error("Error retrieving applications");
    }

    const data: Application[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneApplication = async (
  organizationid: string,
  userId: number,
  id: number,
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/users/${userId}/application/${id}`,
    );

    if (!res.ok) {
      throw new Error("Error retrieving the application");
    }

    const data: Application = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createApplication = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateApplication = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteApplication = async (
  organizationid: string,
  userId: number,
  id: number,
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/users/${userId}/application/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("Error deleting the application");
    }

    console.log("Deleted application");
  } catch (error) {
    console.error(error);
  }
};
