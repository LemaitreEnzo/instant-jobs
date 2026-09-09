import type { Campus } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllCampus = async (organizationid: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/campus`,
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

export const getOneCampus = async (
  organizationid: string,
  campusid: string,
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/campus/${campusid}`,
    );

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

export const createCampus = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateCampus = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteCampus = async (
  organizationid: string,
  campusid: string,
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/campus/${campusid}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("Error deleting the campus");
    }

    console.log("Deleted Campus");
  } catch (error) {
    console.error(error);
  }
};
