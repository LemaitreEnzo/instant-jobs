import { Sequelize } from "sequelize";
import getEnv from "../utils/envHelper";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  database: getEnv("DB_NAME"),
  username: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});
