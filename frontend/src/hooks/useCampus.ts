import type { Campus } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllCampus = async (organizationId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationId}/campus`,
    );

    if (!res.ok) {
      throw new Error("Error retrieving campus");
    }

    const data: Campus[] = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneCampus = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/campus/${id}`);

    if (!res.ok) {
      throw new Error("Error retrieving the campus");
    }

    const data: Campus = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createCampus = async (data: Partial<Campus>) => {
  try {
    const res = await fetch(`${BASE_URL}/campus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error creating the campus");
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateCampus = async (id: number, data: Partial<Campus>) => {
  try {
    const res = await fetch(`${BASE_URL}/campus/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error updating the campus");
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteCampus = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/campus/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the campus");
    }
  } catch (error) {
    console.error(error);
  }
};
