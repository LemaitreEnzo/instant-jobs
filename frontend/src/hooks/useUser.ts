import type { User } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllUsers = async (organizationId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/organization/${organizationId}/users`);

    if (!res.ok) {
      throw new Error("Error retrieving users");
    }

    const data: User[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneUser = async (organizationId: string, id: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationId}/users/${id}`,
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

export const deleteUser = async (organizationId: string, id: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/organization/${organizationId}/users/${id}`,
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
