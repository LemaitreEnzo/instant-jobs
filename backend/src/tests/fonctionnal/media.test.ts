import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

import { Media } from "src/models";
import { UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const MEDIA_URL = `/${VERSION}/media`;

const AUTH_HEADER = { Authorization: "Bearer test-valid-token" };

interface MockUser {
  id: number;
  uuid: string;
  role: UserRole;
  organizationId?: number;
}

let currentUser: MockUser | undefined = {
  id: 1,
  uuid: "00000000-0000-0000-0000-000000000001",
  role: UserRole.ADMIN,
  organizationId: 1,
};

let triggerRateLimit = false;

jest.mock("../../../middlewares/auth.middleware", () => ({
  authenticateUser: jest.fn((req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !currentUser) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing authentication token" });
    }
    req.user = currentUser;
    next();
  }),
  checkUser: jest.fn(
    (allowedRoles: UserRole[] = Object.values(UserRole), model: any = null) =>
      async (req: any, res: any, next: any) => {
        if (!req.user) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        if (!allowedRoles.includes(req.user.role)) {
          return res
            .status(403)
            .json({ message: "Access denied: unauthorized role" });
        }

        if (req.user.role === UserRole.STUDENT) {
          if (model && req.params.id) {
            const targetId = Number(req.params.id);
            try {
              const modelData = await model.findByPk(targetId);
              if (!modelData) {
                return res.status(404).json({ message: "Resource not found" });
              }
              if (modelData.userId !== req.user.id) {
                return res.status(403).json({
                  message:
                    "Access denied: you can only access your own resources.",
                });
              }
            } catch (error) {
              return res
                .status(500)
                .json({ message: "Database verification failed" });
            }
          } else if (req.params.id) {
            const targetId = Number(req.params.id);
            if (req.user.id !== targetId) {
              return res.status(403).json({
                message:
                  "Access denied: a student can only modify their own account.",
              });
            }
          }
        }

        next();
      },
  ),
}));

jest.mock("../../../middlewares/role.middleware", () => ({
  checkRole: jest.fn(
    (allowedRoles: UserRole[]) => (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient privileges" });
    },
  ),
}));

jest.mock("config/rate-limit", () => ({
  customRateLimiter: jest.fn(() => (req: any, res: any, next: any) => {
    if (triggerRateLimit) {
      return res.status(429).json({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    }
    next();
  }),
}));

jest.mock("config/db", () => ({
  sequelize: {
    define: jest.fn(() => ({
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
    })),
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
}));

jest.mock("src/models", () => ({
  Organization: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Campus: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Media: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Promotion: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Speciality: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  SubSpeciality: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Application: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Appointment: { hasMany: jest.fn(), belongsTo: jest.fn() },
}));

const baseMediaData = {
  id: 1,
  name: "CV - Développeur Web",
  path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  userId: 10,
};

const createMockMediaInstance = (data: any = baseMediaData) => {
  const instance: any = {
    ...data,
    dataValues: { ...data },
    update: jest.fn().mockImplementation(async (updateData: any) => {
      Object.assign(instance, updateData);
      Object.assign(instance.dataValues, updateData);
      return instance;
    }),
    destroy: jest.fn(),
  };
  return instance;
};

describe("FUNCTIONAL TESTS - MEDIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    triggerRateLimit = false;
    currentUser = {
      id: 1,
      uuid: "00000000-0000-0000-0000-000000000001",
      role: UserRole.ADMIN,
      organizationId: 1,
    };
  });

  describe("GET /media/:id", () => {
    it("should return 200 and the media when it exists", async () => {
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).get(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "CV - Développeur Web",
        path: baseMediaData.path,
        userId: 10,
      });
      expect(Media.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1" },
        }),
      );
    });

    it("should return 404 if media is not found", async () => {
      jest.mocked(Media.findOne).mockResolvedValue(null);

      const res = await request(app).get(`${MEDIA_URL}/999`).set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Media not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`${MEDIA_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Media.findOne)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app).get(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /media", () => {
    it("should return 201 and create media successfully as admin", async () => {
      const newMediaPayload = {
        name: "Lettre de motivation",
        path: "data:application/pdf;base64,JVBERi0xLjQK...",
        userId: 10,
      };
      const createdMedia = { id: 2, ...newMediaPayload };
      jest.mocked(Media.create).mockResolvedValue(createdMedia as any);

      const res = await request(app)
        .post(MEDIA_URL)
        .set(AUTH_HEADER)
        .send(newMediaPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdMedia);
      expect(Media.create).toHaveBeenCalledWith(newMediaPayload);
    });

    it("should return 201 and create media successfully as student", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const newMediaPayload = {
        name: "Portfolio",
        path: "data:image/jpeg;base64,...",
        userId: 10,
      };
      const createdMedia = { id: 3, ...newMediaPayload };
      jest.mocked(Media.create).mockResolvedValue(createdMedia as any);

      const res = await request(app)
        .post(MEDIA_URL)
        .set(AUTH_HEADER)
        .send(newMediaPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdMedia);
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .post(MEDIA_URL)
        .send({ name: "Document.pdf" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Media.create)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .post(MEDIA_URL)
        .set(AUTH_HEADER)
        .send({ name: "CV" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /media/:id", () => {
    it("should return 200 and update media as admin", async () => {
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { name: "CV - Développeur Fullstack" };
      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("CV - Développeur Fullstack");
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 200 and update media as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { name: "CV - Développeur Fullstack" };
      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("CV - Développeur Fullstack");
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 200 when student updates their own media", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { name: "Mon CV v2" };
      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Mon CV v2");
      expect(Media.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 403 when student attempts to update another user's media", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send({ name: "Hack attempt" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.update).not.toHaveBeenCalled();
    });

    it("should return 404 if media is not found", async () => {
      jest.mocked(Media.findOne).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${MEDIA_URL}/999`)
        .set(AUTH_HEADER)
        .send({ name: "Non-existent" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Media not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .send({ name: "Updated" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Media.findOne)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send({ name: "Updated" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /media/:id", () => {
    it("should return 204 and delete media as admin", async () => {
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 and delete media as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 when student deletes their own media", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Media.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(Media.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 403 when student attempts to delete another user's media", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockMediaInstance();
      jest.mocked(Media.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.update).not.toHaveBeenCalled();
    });

    it("should return 404 if media is not found", async () => {
      jest.mocked(Media.findOne).mockResolvedValue(null);

      const res = await request(app)
        .delete(`${MEDIA_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Media not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).delete(`${MEDIA_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Media.findOne)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 when rate limit is exceeded on POST /media", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .post(MEDIA_URL)
        .set(AUTH_HEADER)
        .send({ name: "CV" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on PATCH /media/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .patch(`${MEDIA_URL}/1`)
        .set(AUTH_HEADER)
        .send({ name: "CV Updated" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on DELETE /media/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app).delete(`${MEDIA_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });
  });
});
