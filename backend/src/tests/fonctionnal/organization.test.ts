import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "models/organizations.model";
import request from "supertest";
import app from "../../../app";
import getSlug from "../../../utils/slugHelper";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");

jest.mock("models/organizations.model", () => ({
    Organization: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn({ id: 1, name: "La Manu", slug: "la-manu" } as any),
        destroy: jest.fn()
    }
}));

describe("GET ORGANIZATIONS", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200", async () => {
        const res = await request(app).get(`/${VERSION}/organizations`);
        expect(res.status).toBe(200);
    });

    it("Returns all organizations", async () => {
        jest.mocked(Organization.findAll).mockResolvedValue([
            { id: 1, name: "La Manu", slug: getSlug("La Manu") } as any,
            { id: 2, name: "Credit Agricole", slug: getSlug("Credit Agricole") } as any
        ]);

        const res = await request(app).get(`/${VERSION}/organizations`);
        expect(res.body).toEqual({
            organizations: [
                { id: 1, name: "La Manu", slug: getSlug("La Manu") },
                { id: 2, name: "Credit Agricole", slug: getSlug("Credit Agricole") }
            ]
        })
    });

    it("Returns one organization", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue(
            { id: 1, name: "La Manu", slug: getSlug("La Manu") } as any,
        );

        const res = await request(app).get(`/${VERSION}/organizations/la-manu`);
        expect(res.body).toEqual({
            organization: {
                id: 1,
                name: "La Manu",
                slug: getSlug("La Manu"),
            },
        })
    })
});

describe("CREATE ORGANIZATION", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("POST -> should return 201", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue(null);
        jest.mocked(Organization.create).mockResolvedValue(
            { id: 1, name: "La Manu", slug: getSlug("La Manu") } as any,
        );

        const res = await request(app)
            .post(`/${VERSION}/organizations`)
            .send({ name: "La Manu", slug: getSlug("La Manu") });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            name: "La Manu",
            slug: getSlug("La Manu"),
        });
    });
});

describe("UPDATE ORGANIZATION", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("PUT -> should return 206", async () => {
        jest.mocked(Organization.findOne).mockResolvedValue({ slug: getSlug("La Manu") } as any);
        jest.mocked(Organization.update).mockResolvedValue(
            { id: 1, name: "ESC Compiègne", slug: getSlug("ESC Compiègne") } as any,
        );

        const res = await request(app)
            .put(`/${VERSION}/organizations/1`)
            .send({ name: "ESC Compiègne", slug: getSlug("ESC Compiègne") });

        expect(res.status).toBe(206);
        expect(res.body).toMatchObject({
            id: 1,
            name: "ESC Compiègne",
            slug: getSlug("ESC Compiègne"),
        });
    });
});

describe("DELETE ORGANIZATION", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 204", async () => {
        jest.mocked(Organization.destroy).mockResolvedValue(
            { id: 1, name: "La Manu", slug: getSlug("La Manu") } as any,
        );

        const res = await request(app).delete(`/${VERSION}/organizations/la-manu`);
        expect(res.status).toBe(204);
        expect(Organization.destroy).toHaveBeenCalled();
    });
});