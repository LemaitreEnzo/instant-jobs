import "dotenv/config";

/**
 * Retrieves the value of an environment variable or throws an error if undefined.
 *
 * @example
 * getEnv("VERSION"); // "v1"
 * getEnv("PORT"); // "3000"
 *
 * @param {string} key The .env variable
 * @returns The value of the variable
 */
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export default getEnv;
