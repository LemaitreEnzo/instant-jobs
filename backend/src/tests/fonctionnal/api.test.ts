import { describe, expect } from "@jest/globals";
import request from "supertest";
import app from "../../../app";

describe("GET /", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
