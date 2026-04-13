import { describe, expect } from "@jest/globals";
import request from "supertest";
import app from "../../../app";

jest.mock("config/db", () => ({
  sequelize: {
    define: jest.fn(() => ({})),
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
  },
}));

describe("GET /", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
