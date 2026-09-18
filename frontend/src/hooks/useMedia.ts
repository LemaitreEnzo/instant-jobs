import type { Media } from "../interfaces/models.interface";
import { BASE_URL } from "../utils/globals.util";

export const getAllMedias = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}/medias`);

    if (!res.ok) {
      throw new Error("Error retrieving medias");
    }

    const data: Media[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOneMedia = async (userId: number, id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}/media/${id}`);

    if (!res.ok) {
      throw new Error("Error retrieving the media");
    }

    const data: Media = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createMedia = async (data: Partial<Media>) => {
  try {
    const res = await fetch(`${BASE_URL}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error creating the media");
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateMedia = async (id: number, data: Partial<Media>) => {
  try {
    const res = await fetch(`${BASE_URL}/media/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error updating the Media");
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteMedia = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/media/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the media");
    }
  } catch (error) {
    console.error(error);
  }
};
