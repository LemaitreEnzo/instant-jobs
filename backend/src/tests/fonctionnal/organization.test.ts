import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Organization } from "models/organizations.model";
import request from "supertest";
import app from "../../../app";

jest.mock("models/organizations.model", () => ({
    Organization: {
        findAll: jest.fn(),
    }
}));

describe("GET /orgzanizations", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200", async () => {
        const res = await request(app).get("/organizations");
        expect(res.status).toBe(200);
    });
    
    it("Get all organizations", async () => {
        jest.mocked(Organization.findAll).mockResolvedValue([
            { id: 1, name: "La Manu" } as any,
            { id: 2, name: "Credit Agricole" } as any
        ]);

        const res = await request(app).get("/organizations");
        expect(res.body).toEqual({
            organizations: [
                { id: 1, name: "La Manu" },
                { id: 2, name: "Credit Agricole" }
            ]
        })
    })
})