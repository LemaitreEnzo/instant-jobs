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

export const createUser = async (data: Partial<User>) => {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error creating the user");
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (id: number, data: Partial<User>) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error updating the user");
    }
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (
  data: Partial<User>,
): Promise<User | undefined> => {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Error logging the user");
    }
    const user: User = await res.json();
    return user;
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
  } catch (error) {
    console.error(error);
  }
};
