import * as bcrypt from "bcryptjs";

const saltRounds = 10;

/**
 * Hashes a plaintext password using bcrypt with a default salt round factor of 10.
 *
 * @param plainPassword - Plaintext password to hash.
 * @returns Hashed password string.
 * @throws Error if hashing fails.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw new Error("Error hashing the password");
  }
}
