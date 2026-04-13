import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UserModel } from "models/users.model";
import request from "supertest";
import app from "../../../app";

jest.mock("models/users.model", () => ({
  UserModel: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("GET all users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
  });

  it("Get all users", async () => {
    jest
      .mocked(UserModel.findAll)
      .mockResolvedValue([
        { id: 1, name: "ee" } as any,
        { id: 2, name: "eeee" } as any,
      ]);

    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      users: [
        { id: 1, name: "ee" },
        { id: 2, name: "eeee" },
      ],
    });
  });
});
