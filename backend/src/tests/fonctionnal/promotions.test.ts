import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

import { Promotion, Speciality } from "src/models";
import { UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const PROMOTION_URL = `/${VERSION}/promotion`;

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
  checkUser: jest.fn(() => (req: any, res: any, next: any) => next()),
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
    findByPk: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Campus: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Media: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Promotion: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Speciality: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  SubSpeciality: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Application: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Appointment: { hasMany: jest.fn(), belongsTo: jest.fn() },
}));

const basePromotionData = {
  id: 1,
  name: "Promotion 2026 - Bachelor Développeur Full-Stack - Campus Compiègne",
  campusId: 1,
};

const createMockPromotionInstance = (data: any = basePromotionData) => {
  const instance: any = {
    ...data,
    dataValues: { ...data },
    get: jest.fn((options?: { plain?: boolean }) => ({ ...instance })),
    update: jest.fn().mockImplementation(async (updateData: any) => {
      Object.assign(instance, updateData);
      Object.assign(instance.dataValues, updateData);
      return instance;
    }),
    destroy: jest.fn(),
  };
  return instance;
};

const mockSpecialities = [
  {
    id: 1,
    name: "Développement Web & Mobile",
    promotionId: 1,
  },
  {
    id: 2,
    name: "Architecture Cloud & DevOps",
    promotionId: 1,
  },
];

const AUTH_HEADER = { Authorization: "Bearer test-valid-token" };

describe("FUNCTIONAL TESTS - PROMOTION", () => {
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

  describe("GET /promotion/:id", () => {
    it("should return 200 with one promotion", async () => {
      const mockInstance = createMockPromotionInstance();
      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "Promotion 2026 - Bachelor Développeur Full-Stack - Campus Compiègne",
        campusId: 1,
      });
      expect(Promotion.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1" },
        }),
      );
    });

    it("should return 404 if the promotion doesn't exist", async () => {
      jest.mocked(Promotion.findOne).mockResolvedValue(null);

      const res = await request(app)
        .get(`${PROMOTION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Promotion not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${PROMOTION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if there is a database error", async () => {
      jest
        .mocked(Promotion.findOne)
        .mockRejectedValue(new Error("Database connection failure"));

      const res = await request(app)
        .get(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /promotion", () => {
    const newPromotionPayload = {
      name: "Promotion 2026 - Bachelor Développeur Full-Stack",
      campusId: 1,
    };

    it("should return 201 with the new promotion when an admin creates it", async () => {
      const createdInstance = createMockPromotionInstance({
        id: 1,
        ...newPromotionPayload,
      });
      jest.mocked(Promotion.create).mockResolvedValue(createdInstance as any);

      const res = await request(app)
        .post(PROMOTION_URL)
        .set(AUTH_HEADER)
        .send(newPromotionPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        name: "Promotion 2026 - Bachelor Développeur Full-Stack",
        campusId: 1,
      });
      expect(Promotion.create).toHaveBeenCalledWith(newPromotionPayload);
    });

    it("should return 201 with the new promotion when a staff creates it", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const createdInstance = createMockPromotionInstance({
        id: 1,
        ...newPromotionPayload,
      });
      jest.mocked(Promotion.create).mockResolvedValue(createdInstance as any);

      const res = await request(app)
        .post(PROMOTION_URL)
        .set(AUTH_HEADER)
        .send(newPromotionPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        name: "Promotion 2026 - Bachelor Développeur Full-Stack",
        campusId: 1,
      });
      expect(Promotion.create).toHaveBeenCalledWith(newPromotionPayload);
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .post(PROMOTION_URL)
        .set(AUTH_HEADER)
        .send(newPromotionPayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Promotion.create).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app)
        .post(PROMOTION_URL)
        .send(newPromotionPayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the creation fails", async () => {
      jest
        .mocked(Promotion.create)
        .mockRejectedValue(new Error("SequelizeDatabaseError"));

      const res = await request(app)
        .post(PROMOTION_URL)
        .set(AUTH_HEADER)
        .send(newPromotionPayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /promotion/:id", () => {
    const updatePayload = {
      name: "Promotion 2026 - Bachelor Développeur Full-Stack (Mis à jour)",
    };

    it("should return 200 with the updated promotion when an admin updates it", async () => {
      const mockInstance = createMockPromotionInstance();
      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "Promotion 2026 - Bachelor Développeur Full-Stack (Mis à jour)",
        campusId: 1,
      });
      expect(mockInstance.update).toHaveBeenCalledWith(updatePayload);
    });

    it("should return 200 with the updated promotion when a staff updates it", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const mockInstance = createMockPromotionInstance();
      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "Promotion 2026 - Bachelor Développeur Full-Stack (Mis à jour)",
        campusId: 1,
      });
      expect(mockInstance.update).toHaveBeenCalledWith(updatePayload);
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .patch(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Promotion.findOne).not.toHaveBeenCalled();
    });

    it("should return 404 if the promotion doesn't exist", async () => {
      jest.mocked(Promotion.findOne).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${PROMOTION_URL}/999`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Promotion not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app)
        .patch(`${PROMOTION_URL}/1`)
        .send(updatePayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the update fails", async () => {
      const mockInstance = createMockPromotionInstance();
      mockInstance.update = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Update failed"));

      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /promotion/:id", () => {
    it("should return 204 when an admin deletes a promotion", async () => {
      const mockInstance = createMockPromotionInstance();
      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(res.text).toBe("");
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 when a staff deletes a promotion", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const mockInstance = createMockPromotionInstance();
      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(res.text).toBe("");
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .delete(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Promotion.findOne).not.toHaveBeenCalled();
    });

    it("should return 404 if the promotion doesn't exist", async () => {
      jest.mocked(Promotion.findOne).mockResolvedValue(null);

      const res = await request(app)
        .delete(`${PROMOTION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Promotion not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).delete(`${PROMOTION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the delete fails", async () => {
      const mockInstance = createMockPromotionInstance();
      mockInstance.destroy = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Delete failed"));

      jest.mocked(Promotion.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /promotion/:promotionId/specialities", () => {
    it("should return 200 with all specialities of the promotion", async () => {
      jest
        .mocked(Speciality.findAll)
        .mockResolvedValue(mockSpecialities as any);

      const res = await request(app)
        .get(`${PROMOTION_URL}/1/specialities`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: 1,
        name: "Développement Web & Mobile",
        promotionId: 1,
      });
      expect(Speciality.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { promotionId: "1" },
        }),
      );
    });

    it("should return 200 with empty array if no speciality exists", async () => {
      jest.mocked(Speciality.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${PROMOTION_URL}/1/specialities`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${PROMOTION_URL}/1/specialities`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the specialities search fails", async () => {
      jest
        .mocked(Speciality.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${PROMOTION_URL}/1/specialities`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 if the user exceeded the rate limit", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .get(`${PROMOTION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(429);
      expect(res.body).toMatchObject({
        error: "Too many requests",
        message: expect.stringContaining("You have exceeded the rate limit"),
        retryAfter: expect.any(Number),
      });
    });
  });
});
