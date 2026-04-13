/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^models/(.*)$": "<rootDir>/src/models/$1",
    "^routes/(.*)$": "<rootDir>/src/routes/$1",
    "^controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^config/(.*)$": "<rootDir>/config/$1",
  },
};
