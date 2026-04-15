import { Sequelize } from "sequelize";
import getEnv from "../utils/envHelper";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  database: getEnv("DB_NAME"),
  username: getEnv("DB_USERNAME"),
  password: getEnv("DB_PASSWORD"),
  logging: false,
});
