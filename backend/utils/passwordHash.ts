import * as bcrypt from "bcryptjs";

const saltRounds = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing the password");
  }
}
