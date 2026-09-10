import type { Application } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllApplications = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}/application`);

    if (!res.ok) {
      throw new Error("Error retrieving applications");
    }

    const data: Application[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneApplication = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/application/${id}`);

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

export const deleteApplication = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/application/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the application");
    }

    console.log("Deleted application");
  } catch (error) {
    console.error(error);
  }
};
