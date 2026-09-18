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

export const createApplication = async (data: Partial<Application>) => {
  try {
    const res = await fetch(`${BASE_URL}/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error creating the application");
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateApplication = async (
  id: number,
  data: Partial<Application>,
) => {
  try {
    const res = await fetch(`${BASE_URL}/application/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error updating the application");
    }
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
  } catch (error) {
    console.error(error);
  }
};
