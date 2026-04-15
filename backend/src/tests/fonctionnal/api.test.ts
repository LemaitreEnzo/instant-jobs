import { describe, expect } from "@jest/globals";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");

// Create mock for DB
jest.mock("config/db", () => ({
  sequelize: {
    define: jest.fn(() => ({})),
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
  },
}));

describe(`GET /${VERSION}`, () => {
  it("should return 200", async () => {
    const res = await request(app).get(`/${VERSION}`);
    expect(res.status).toBe(200);
  });
});
