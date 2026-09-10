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

export const createMedia = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const updateMedia = async () => {
  try {
    // Code here
  } catch (error) {
    console.error(error);
  }
};

export const deleteMedia = async (userId: number, id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}/media/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the media");
    }

    console.log("Deleted user");
  } catch (error) {
    console.error(error);
  }
};
