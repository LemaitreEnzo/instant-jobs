import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "models/organizations.model";
import { User } from "models/users.model";
import { Application } from "src/models/applications.model";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const APPLICATIONS_URL = `/${VERSION}/organization/la-manu/users/1/application`;

// Create mock for organization model
jest.mock("models/organizations.model", () => ({
  Organization: {
    findOne: jest.fn(),
  },
}));
// Create mock for user model
jest.mock("models/users.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("models/applications.model", () => ({
  Application: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn({
      id: 1,
      title: "Candidature pour Betafluides",
      type: "Alternance",
    } as any),
    destroy: jest.fn(),
  },
}));

describe("GET APPLICATIONS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200", async () => {
    const res = await request(app).get(APPLICATIONS_URL);
    expect(res.status).toBe(200);
  });

  it("Returns all applications", async () => {
    jest.mocked(Organization.findOne).mockResolvedValue({
      id: 1,
    } as any);
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    jest.mocked(Application.findAll).mockResolvedValue([
      {
        id: 1,
        title: "Candidature pour Betafluides",
        type: "Alternance",
      } as any,
      { id: 2, title: "Candidature pour Anthedesign", type: "Stage" } as any,
    ]);

    const res = await request(app).get(APPLICATIONS_URL);
    expect(res.body).toEqual({
      applications: [
        { id: 1, title: "Candidature pour Betafluides", type: "Alternance" },
        { id: 2, title: "Candidature pour Anthedesign", type: "Stage" },
      ],
    });
  });

  it("Return one application", async () => {
    jest.mocked(Application.findOne).mockResolvedValue({
      id: 1,
      title: "Candidature pour Betafluides",
      type: "Alternance",
    } as any);

    const res = await request(app).get(`${APPLICATIONS_URL}/1`);
    expect(res.body).toEqual({
      application: {
        id: 1,
        title: "Candidature pour Betafluides",
        type: "Alternance",
      },
    });
  });
});

describe("CREATE APPLICATION", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST -> should return 201", async () => {
    jest.mocked(Application.findOne).mockResolvedValue(null);
    jest.mocked(Application.create).mockResolvedValue({
      id: 1,
      name: "Candidature pour Betafluides",
      type: "Alternance",
    } as any);

    const res = await request(app)
      .post(APPLICATIONS_URL)
      .send({ name: "Candidature pour Betafluides", type: "Alternance" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: "Candidature pour Betafluides",
      type: "Alternance",
    });
  });
});

describe("UPDATE APPLICATION", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("PUT -> should return 206", async () => {
    jest.mocked(Application.findOne).mockResolvedValue({
      id: 1,
      name: "Candidature pour Betafluides",
      type: "Alternance",
    } as any);
    jest.mocked(Application.update).mockResolvedValue({
      id: 1,
      name: "Candidature pour Dronexperts",
      type: "Alternance",
    } as any);

    const res = await request(app)
      .patch(`${APPLICATIONS_URL}/1`)
      .send({ name: "Candidature pour Dronexperts", type: "Alternance" });

    expect(res.status).toBe(206);
    expect(res.body).toMatchObject({
      applicationUpdated: {
        id: 1,
        name: "Candidature pour Dronexperts",
        type: "Alternance",
      },
    });
  });
});

describe("DELETE APPLICATION", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 204", async () => {
    jest.mocked(Application.destroy).mockResolvedValue({
      id: 1,
      name: "Candidature pour Betafluides",
      type: "Alternance",
    } as any);
    const res = await request(app).delete(`${APPLICATIONS_URL}/1`);

    expect(res.status).toBe(204);
    expect(Application.destroy).toHaveBeenCalled();
  });
});
