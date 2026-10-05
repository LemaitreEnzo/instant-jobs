import getEnv from "../../utils/envHelper";

require("dotenv").config();

module.exports = {
  development: {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    database: getEnv("DB_NAME"),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    dialect: "postgres",
  },
  test: {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    database: `${getEnv("DB_NAME")}_test`,
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    dialect: "postgres",
  },
  production: {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    database: getEnv("DB_NAME"),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    dialect: "postgres",
    logging: false,
  },
};
