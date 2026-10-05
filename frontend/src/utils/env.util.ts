// src/utils/envHelper.ts

// Vite exposes the current environment mode via import.meta.env.MODE (e.g., "development", "production")
export const CURRENT_ENV = import.meta.env.MODE;

/**
 * Retrieves the value of a Vite environment variable or throws a strict error if undefined.
 *
 * @example
 * getEnv("VITE_API_URL"); // "https://example.com"
 *
 * @param {string} key The environment variable key (must start with VITE_)
 * @returns The value of the variable
 */
const getEnv = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `[${CURRENT_ENV.toUpperCase()}] Missing environment variable: ${key}`,
    );
  }

  return value;
};

export default getEnv;
