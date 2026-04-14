import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Media } from "src/models/medias.model";
import { User } from "src/models/users.model";
import request from "supertest";
import app from "../../../app";

const MEDIA_URL = "/users/1/docs/medias";

// Create mock for user model
jest.mock("models/users.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("models/medias.model", () => ({
  Media: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("GET MEDIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 200", async () => {
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);
    const res = await request(app).get(MEDIA_URL);
    expect(res.status).toBe(200);
  });

  it("Returns all medias", async () => {
    // Create mock for findAll fuction
    jest
      .mocked(Media.findAll)
      .mockResolvedValue([
        { id: 1, name: "ee" } as any,
        { id: 2, name: "eeee" } as any,
      ]);
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app).get(MEDIA_URL);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      medias: [
        { id: 1, name: "ee" },
        { id: 2, name: "eeee" },
      ],
    });
  });

  it("Returns one media", async () => {
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);
    jest.mocked(Media.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app).get(`${MEDIA_URL}/1`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      media: { id: 1, name: "ee" },
    });
  });
});

describe("CREATE ONE MEDIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create one Media", async () => {
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);
    jest
      .mocked(Media.create)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app)
      .post(MEDIA_URL)
      .send({ name: "instant-jobs" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      users: { id: expect.any(Number), name: "instant-jobs" },
    });
  });
});

describe("UPDATE MEDIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("update one media", async () => {
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);
    jest.mocked(Media.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);

    const res = await request(app)
      .patch(`${MEDIA_URL}/1`)
      .send({ name: "La manu" });
    expect(res.status).toBe(206);
  });
});

describe("DELETE ONE MEDIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Delete", async () => {
    jest.mocked(User.findOne).mockResolvedValue({ id: 1, name: "ee" } as any);
    jest
      .mocked(Media.destroy)
      .mockResolvedValue({ id: 1, name: "instant-jobs" } as any);

    const res = await request(app).delete("/users/1/docs/medias/1");
    expect(res.status).toBe(204);
    expect(Media.destroy).toHaveBeenCalled();
  });
});
