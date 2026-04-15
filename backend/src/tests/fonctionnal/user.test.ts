import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "src/models/organizations.model";
import { User } from "models/users.model";
import request from "supertest";
import app from "../../../app";
import getSlug from "../../../utils/slugHelper";

const USERS_URL = "/organizations/la-manu/users"

jest.mock("models/organizations.model", () => ({
  Organization: {
    findOne: jest.fn(),
  },
}));

// Create mock for user model
jest.mock("models/users.model", () => ({
  User: {
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
    const res = await request(app).get(USERS_URL);
    expect(res.status).toBe(200);
  });

  it("Returns all users", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    // Create mock for findAll fuction
    jest
      .mocked(User.findAll)
      .mockResolvedValue([
        { id: 1, name: "ee" } as any,
        { id: 2, name: "eeee" } as any,
      ]);

    const res = await request(app).get(USERS_URL);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      users: [
        { id: 1, name: "ee" },
        { id: 2, name: "eeee" },
      ],
    });
  });

  it("Returns one user", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app).get(`${USERS_URL}/1`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      user: { id: 1, name: "ee" },
    });
  });
});

describe("CREATE ONE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create one user", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    jest
      .mocked(User.create)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app)
      .post(USERS_URL)
      .send({ name: "instant-jobs" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user: { 
        id: expect.any(Number), 
        name: "instant-jobs" 
      },
    });
  });
});

describe("UPDATE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("update one user", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app).patch(`${USERS_URL}/1`).send({ name: "oo" });
    expect(res.status).toBe(206);
  });
});

describe("DELETE ONE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Delete", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    jest
      .mocked(User.destroy)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app).delete(`${USERS_URL}/1`);
    expect(res.status).toBe(204);
    expect(User.destroy).toHaveBeenCalled();
  });
});
