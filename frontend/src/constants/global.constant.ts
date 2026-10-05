import getEnv from "../utils/env.util";

export const BASE_URL: string = `${getEnv("VITE_BASE_API_URL")}/${getEnv("VITE_API_VERSION")}`;
