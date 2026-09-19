import { BASE_URL } from "../constants/global.constant";
import type { Student, User } from "../interfaces/user.interface";

export const getAllUsers = async (
  organizationId: number,
): Promise<User[] | undefined> => {
  try {
    const res = await fetch(`${BASE_URL}/organization/${organizationId}/users`);

    if (!res.ok) return;

    const data: User[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneUser = async (
  id: number,
): Promise<User | Student | undefined> => {
  try {
    const res = await fetch(`${BASE_URL}/user/${id}`);
    if (!res.ok) return;
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

    if (!res.ok) return;
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

    if (!res.ok) return;
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (
  data: Partial<User>,
): Promise<User | Student | undefined> => {
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
    if (!res.ok) return;
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

    if (!res.ok) return;
  } catch (error) {
    console.error(error);
  }
};
