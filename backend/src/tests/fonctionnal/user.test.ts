import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "src/models/organizations.model";
import { User } from "models/users.model";
import request from "supertest";
import app from "../../../app";
import getSlug from "../../../utils/slugHelper";
import getEnv from "../../../utils/envHelper";
import {createUser} from "../../controllers/users.controller"
import { response } from "express";

const VERSION = getEnv("VERSION");
const USERS_URL = `/${VERSION}/organizations/la-manu/users`;

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
        { id: 1, firstname: "ee" } as any,
        { id: 2, firstname: "eeee" } as any,
      ]);

    const res = await request(app).get(USERS_URL);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      users: [ 
        { id: 1, firstname: "ee" },
        { id: 2, firstname: "eeee" },
      ],
    });
  });

  it("Returns one user", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, firstname: "ee", email: "test@test.fr" } as any);

    const res = await request(app).get(`${USERS_URL}/1`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      user: { id: 1, firstname: "ee", email: "test@test.fr"},
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
      .mockResolvedValue({ id: 1, firstname: "instant-jobs", lastname: "instant-jobs", email: "test@test.fr", phone: "0606060606", password_hash: "test", organisation_id: 1 } as any);

    const res = await request(app)
      .post(USERS_URL)
      .send({ firstname: "instant-jobs", lastname: "instant-jobs", email: "test@test.fr", phone: "0606060606", password_hash: "test", organisation_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user: { 
        id: expect.any(Number), 
        firstname: "instant-jobs",
      },
    });
  });
});

describe("UPDATE USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("update one user", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, firstname: "La Manu", slug: getSlug("La Manu") } as any);
    jest.mocked(User.update).mockResolvedValue({ id: 1, firstname: "oo" } as any);

    const res = await request(app).patch(`${USERS_URL}/1`).send({ firstname: "oo" }); 
    expect(res.status).toBe(206);
    expect(res.body).toMatchObject({
      user: { 
        id: expect.any(Number), 
        firstname: "oo",
      },
    });
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
