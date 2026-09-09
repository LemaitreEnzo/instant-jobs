import type { User } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllUsers = async (organizationid: string) => {
  try {
    const res = await fetch(`${BASE_URL}/organization/${organizationid}/users`);

    if (!res.ok) {
      throw new Error("Error retrieving users");
    }

    const data: User[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneUser = async (organizationid: string, id: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/users/${id}`,
    );

    if (!res.ok) {
      throw new Error("Error retrieving the user");
    }

    const data: User = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (organizationid: string, id: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationid}/users/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("Error deleting the user");
    }

    console.log("Deleted user");
  } catch (error) {
    console.error(error);
  }
};
