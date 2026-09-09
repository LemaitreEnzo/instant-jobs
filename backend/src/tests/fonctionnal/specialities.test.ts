import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Promotion } from "src/models/promotions.model";
import { Speciality } from "src/models/specialities.model";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const Speciality_URL = `/${VERSION}/organization/la-manu/campus/compiegne/promotion/b3/specialities`;

jest.mock("models/promotions.model", () => ({
  Promotion: {
    findOne: jest.fn(),
  },
}));

jest.mock("models/specialities.model", () => ({
  Speciality: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET Speciality", () => {
  it("should return 200", async () => {
    const res = await request(app).get(Speciality_URL);
    expect(res.status).toBe(200);
  });

  it("Returns all Speciality", async () => {
    jest
      .mocked(Speciality.findAll)
      .mockResolvedValue([
        { id: 1, name: "Designeur" } as any,
        { id: 2, name: "Développeur" } as any,
      ]);

    const res = await request(app).get(Speciality_URL);
    expect(res.body).toEqual({
      Speciality: [
        { id: 1, name: "Designeur" },
        { id: 2, name: "Développeur" },
      ],
    });
  });

  it("Return one speciality", async () => {
    jest.mocked(Speciality.findOne).mockResolvedValue({
      id: 1,
      name: "Designeur",
    } as any);

    const res = await request(app).get(`${Speciality_URL}/1`);
    expect(res.body).toEqual({
      speciality: {
        id: 1,
        name: "Designeur",
      },
    });
  });
});

describe("CREATE SPECIALITY", () => {
  it("POST -> should return 201", async () => {
    jest.mocked(Promotion.findOne).mockResolvedValue({
      id: 1,
      name: "b3",
      organizationId: 1,
    } as any);
    jest.mocked(Speciality.create).mockResolvedValue({
      id: 1,
      name: "Designeur",
    } as any);

    const res = await request(app)
      .post(Speciality_URL)
      .send({ name: "Designeur" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: "Designeur",
    });
  });
});

describe("UPDATE SPECIALITY", () => {
  it("PATCH -> should return 206", async () => {
    jest.mocked(Promotion.findOne).mockResolvedValue({
      id: 1,
      name: "B3",
      organizationId: 1,
    } as any);
    jest.mocked(Speciality.findOne).mockResolvedValue({ id: 1 } as any);
    jest.mocked(Speciality.update).mockResolvedValue({
      id: 1,
      name: "Marketing",
    } as any);

    const res = await request(app)
      .patch(`${Speciality_URL}/1`)
      .send({ name: "Marketing" });

    expect(res.status).toBe(206);
    expect(res.body).toMatchObject({
      specialityUpdated: {
        id: expect.any(Number),
        name: "Marketing",
      },
    });
  });
});

describe("DELETE SPECIALITY", () => {
  it("should return 204", async () => {
    jest.mocked(Promotion.findOne).mockResolvedValue({
      id: 1,
      name: "Compiègne",
    } as any);
    jest.mocked(Speciality.destroy).mockResolvedValue({
      id: 1,
      name: "Designeur",
    } as any);
    const res = await request(app).delete(`${Speciality_URL}/designeur`);

    expect(res.status).toBe(204);
    expect(Speciality.destroy).toHaveBeenCalled();
  });
});
