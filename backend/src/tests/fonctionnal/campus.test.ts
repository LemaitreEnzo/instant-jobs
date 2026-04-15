import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "models/organizations.model";
import { Campus } from "models/campus.model";
import request from "supertest";
import app from "../../../app";
import getEnv from "../../../utils/envHelper";
import getSlug from "../../../utils/slugHelper";

const VERSION = getEnv("VERSION");
const CAMPUS_URL = `/${VERSION}/organizations/la-manu/campus`

// Create mock for organization model
jest.mock("models/organizations.model", () => ({
  Organization: {
    findOne: jest.fn(),
  },
}));

jest.mock("models/campus.model", () => ({
    Campus: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn({ id: 1, name: "Compiègne", slug: "compiegne" } as any),
        destroy: jest.fn()
    }
}));

describe("GET CAMPUS", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200", async () => {
        const res = await request(app).get(CAMPUS_URL);
        expect(res.status).toBe(200);
    });

    it("Returns all campus", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
        jest.mocked(Campus.findAll).mockResolvedValue([
            { id: 1, name: "Compiègne", slug: getSlug("Compiègne") } as any,
            { id: 2, name: "Amiens", slug: getSlug("Amiens") } as any
        ]);

        const res = await request(app).get(CAMPUS_URL);
        expect(res.body).toEqual({
            campus: [
                { id: 1, name: "Compiègne", slug: getSlug("Compiègne") },
                { id: 2, name: "Amiens", slug: getSlug("Amiens") }
            ]
        })
    });

    it("Returns one campus", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
        jest.mocked(Campus.findOne).mockResolvedValue(
            { id: 1, name: "Compiègne", slug: getSlug("Compiègne") } as any,
        );

        const res = await request(app).get(`${CAMPUS_URL}/compiegne`);
        expect(res.body).toEqual({
            campus: {
                id: 1,
                name: "Compiègne",
                slug: getSlug("Compiègne"),
            },
        })
    })
});

describe("CREATE CAMPUS", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("POST -> should return 201", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
        jest.mocked(Campus.findOne).mockResolvedValue(null);
        jest.mocked(Campus.create).mockResolvedValue(
            { id: 1, name: "Compiègne", slug: getSlug("Compiègne") } as any,
        );

        const res = await request(app)
            .post(CAMPUS_URL)
            .send({ name: "Compiègne", slug: getSlug("Compiègne") });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            name: "Compiègne",
            slug: getSlug("Compiègne"),
        });
    });
});

describe("UPDATE CAMPUS", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("PUT -> should return 206", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
        jest.mocked(Campus.findOne).mockResolvedValue({ slug: getSlug("Compiègne") } as any);
        jest.mocked(Campus.update).mockResolvedValue(
            { id: 1, name: "Amiens", slug: getSlug("Amiens") } as any,
        );

        const res = await request(app)
            .put(`${CAMPUS_URL}/compiegne`)
            .send({ name: "Amiens", slug: getSlug("Amiens") });

        expect(res.status).toBe(206);
        expect(res.body).toMatchObject({
            id: 1,
            name: "Amiens",
            slug: getSlug("Amiens"),
        });
    });
});

describe("DELETE CAMPUS", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 204", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ id: 1, name: "La Manu", slug: getSlug("La Manu") } as any);
        jest.mocked(Campus.destroy).mockResolvedValue(
            { id: 1, name: "Compiègne", slug: getSlug("Compiègne") } as any,
        );

        const res = await request(app).delete(`${CAMPUS_URL}/compiegne`);
        expect(res.status).toBe(204);
        expect(Campus.destroy).toHaveBeenCalled();
    });
});