import { Sequelize } from "sequelize";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variable d'environnement manquante : ${key}`);
  return value;
};

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  database: getEnv("DB_NAME"),
  username: getEnv("DB_USERNAME"),
  password: getEnv("DB_PASSWORD"),
  logging: false,
});
