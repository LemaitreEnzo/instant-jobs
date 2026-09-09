import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Promotion } from "models/promotions.model";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const Promotion_URL = `/${VERSION}/organization/la-manu/campus/compiegne/promotion`;

jest.mock("models/organizations.model", () => ({
  Organization: {
    findOne: jest.fn(),
  },
}));

jest.mock("models/promotions.model", () => ({
  Promotion: {
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

describe("GET Promotion", () => {
  it("should return 200", async () => {
    const res = await request(app).get(Promotion_URL);
    expect(res.statusCode).toBe(200);
  });

  it("Returns all Promotion", async () => {
    jest
      .mocked(Promotion.findAll)
      .mockResolvedValue([
        { id: 1, name: "B1", organisationId: 1 } as any,
        { id: 2, name: "B2", organisationId: 1 } as any,
      ]);

    const res = await request(app).get(Promotion_URL);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      Promotion: [
        { id: 1, name: "B1", organisationId: 1 },
        { id: 2, name: "B2", organisationId: 1 },
      ],
    });
  });

  it("Returns one promotion", async () => {
    jest.mocked(Promotion.findOne).mockResolvedValue({
      id: 1,
      name: "B1",
      organisationId: 1,
    } as any);

    const res = await request(app).get(`${Promotion_URL}/1`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      promotion: { id: 1, name: "B1", organisationId: 1 },
    });
  });
});

describe("CREATE Promotion", () => {
  it("Create one promotion", async () => {
    jest.mocked(Promotion.create).mockResolvedValue({
      id: 1,
      name: "B1",
      organisationId: 1,
    } as any);

    const res = await request(app)
      .post(Promotion_URL)
      .send({ name: "B1", organisationId: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      promotion: {
        id: expect.any(Number),
        name: "B1",
        organisationId: 1,
      },
    });
  });
});

describe("UPDATE Promotion", () => {
  it("Update one promotion", async () => {
    jest.mocked(Promotion.findOne).mockResolvedValue({ id: 1 } as any);
    jest.mocked(Promotion.update).mockResolvedValue({
      id: 1,
      name: "B3",
      organisationId: 1,
    } as any);

    const res = await request(app)
      .patch(`${Promotion_URL}/1`)
      .send({ name: "B3", organisationId: 1 });

    expect(res.statusCode).toBe(206);
    expect(res.body).toMatchObject({
      promotion: {
        id: expect.any(Number),
        name: "B3",
        organisationId: 1,
      },
    });
  });
});

describe("DELETE Promotion", () => {
  it("Delete one promotion", async () => {
    jest.mocked(Promotion.destroy).mockResolvedValue({
      id: 1,
      name: "B3",
      organisationId: 1,
    } as any);

    const res = await request(app).delete(`${Promotion_URL}/1`);

    expect(res.statusCode).toBe(204);
    expect(Promotion.destroy).toHaveBeenCalled();
  });
});
