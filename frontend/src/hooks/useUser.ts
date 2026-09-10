import type { User } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllUsers = async (
  organizationId: number,
): Promise<User[] | undefined> => {
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

export const getOneUser = async (id: number): Promise<User | undefined> => {
  try {
    const res = await fetch(`${BASE_URL}/user/${id}`);

    if (!res.ok) {
      throw new Error("Error retrieving the user");
    }

    const data: User = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (): Promise<void> => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (): Promise<void> => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (): Promise<void> => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${BASE_URL}/user/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the user");
    }

    console.log("Deleted user");
  } catch (error) {
    console.error(error);
  }
};
