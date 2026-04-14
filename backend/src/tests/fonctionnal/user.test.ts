import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UserModel } from "models/users.model";
import request from "supertest";
import app from "../../../app";

// Create mock for user model
jest.mock("models/users.model", () => ({
  UserModel: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("GET USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 200", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
  });

  it("Returns all users", async () => {
    // Create mock for findAll fuction
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

  it("Returns one user", async () => {
    jest
      .mocked(UserModel.findOne)
      .mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      users: { id: 1, name: "ee" },
    });
  });
});

describe("CREATE ONE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create one user", async () => {
    jest
      .mocked(UserModel.create)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app)
      .post("/users")
      .send({ id: 1, name: "instant-jobs" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      users: { id: expect.any(Number), name: "instant-jobs" },
    });
  });

  it("Returns a 409 error if a user's email address is already in use.", async () => {
    jest
      .mocked(UserModel.findOne)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app)
      .post("/users")
      .send({ id: 1, name: "instant-jobs" });

    expect(res.status).toBe(409);
    expect(UserModel.create).not.toHaveBeenCalled();
  });
});

describe("DELETE ONE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Delete", async () => {
    jest
      .mocked(UserModel.destroy)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
    expect(UserModel.destroy).toHaveBeenCalled();
  });
});
