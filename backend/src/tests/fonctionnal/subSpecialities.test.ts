import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SubSpeciality } from "src/models/subSpecialities.model";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const SubSpeciality_URL = `/${VERSION}/organization/la-manu/campus/compiegne/promotion/b3/speciality/dev/sub-speciality`;

jest.mock("model/subSpecialities.model", () => ({
  SubSpeciality: {
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

describe("GET SubSpeciality", () => {
  it("should return 200", async () => {
    const res = await request(app).get(SubSpeciality_URL);
    expect(res.statusCode).toBe(200);
  });

  it("Returns all SubSpeciality", async () => {
    jest.mocked(SubSpeciality.findAll).mockResolvedValue([
      {
        id: 1,
        name: "frontend",
        specialityId: 1,
      } as any,
      {
        id: 2,
        name: "backend",
        specialityId: 1,
      } as any,
    ]);

    const res = await request(app).get(SubSpeciality_URL);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      SubSpeciality: [
        { id: 1, name: "frontend", specialityId: 1 },
        { id: 2, name: "backend", specialityId: 1 },
      ],
    });
  });

  it("Returns one subSpeciality", async () => {
    jest.mocked(SubSpeciality.findOne).mockResolvedValue({
      id: 1,
      name: "frontend",
      specialityId: 1,
    } as any);

    const res = await request(app).get(`${SubSpeciality_URL}/1`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      subSpeciality: {
        id: 1,
        name: "frontend",
        specialityId: 1,
      },
    });
  });
});

describe("CREATE subSpeciality", () => {
  it("Create one subSpeciality", async () => {
    jest.mocked(SubSpeciality.create).mockResolvedValue({
      id: 1,
      name: "frontend",
      specialityId: 1,
    } as any);

    const res = await request(app)
      .post(SubSpeciality_URL)
      .send({ name: "frontend", specialityId: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      subSpeciality: {
        id: expect.any(Number),
        name: "frontend",
        specialityId: 1,
      },
    });
  });
});

describe("UPDATE subSpeciality", () => {
  it("Update one subSpeciality", async () => {
    jest.mocked(SubSpeciality.findOne).mockResolvedValue({ id: 1 } as any);
    jest.mocked(SubSpeciality.update).mockResolvedValue({
      id: 1,
      name: "backend",
      specialityId: 1,
    } as any);

    const res = await request(app)
      .patch(`${SubSpeciality_URL}/1`)
      .send({ name: "backend", specialityId: 1 });

    expect(res.statusCode).toBe(206);
    expect(res.body).toMatchObject({
      subSpeciality: {
        id: expect.any(Number),
        name: "backend",
        specialityId: 1,
      },
    });
  });
});

describe("DELETE subSpeciality", () => {
  it("Delete one subSpeciality", async () => {
    jest.mocked(SubSpeciality.destroy).mockResolvedValue({
      id: 1,
      name: "frontend",
      specialityId: 1,
    } as any);

    const res = await request(app).delete(`${SubSpeciality_URL}/1`);

    expect(res.statusCode).toBe(204);
    expect(SubSpeciality.destroy).toHaveBeenCalled();
  });
});
