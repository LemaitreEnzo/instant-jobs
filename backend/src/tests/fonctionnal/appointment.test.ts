import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

import { Appointment } from "src/models";
import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const APPOINTMENT_URL = `/${VERSION}/appointment`;

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
        const user = req.user;
        if (!user) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        if (!allowedRoles.includes(user.role)) {
          return res
            .status(403)
            .json({ message: "Access denied: unauthorized role" });
        }

        if (req.method === "POST" && user.role === UserRole.STUDENT && model) {
          if (req.body?.userId && Number(req.body.userId) !== user.id) {
            return res.status(403).json({
              message:
                "Access denied: you cannot create resources for another user.",
            });
          }
          if (req.body) {
            req.body.userId = user.id;
          }
          return next();
        }

        const rawTargetId = req.params.id ?? req.params.userId;
        if (rawTargetId) {
          const targetId = Number(rawTargetId);
          if (Number.isNaN(targetId) || targetId <= 0) {
            return res
              .status(400)
              .json({ message: "Invalid resource identifier" });
          }

          if (model) {
            try {
              const resource = await model.findByPk(targetId);
              if (!resource) {
                return res.status(404).json({ message: "Resource not found" });
              }
              if (
                user.role === UserRole.STUDENT &&
                resource.userId !== user.id
              ) {
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
          } else if (user.role === UserRole.STUDENT && user.id !== targetId) {
            return res.status(403).json({
              message:
                "Access denied: a student can only modify their own account.",
            });
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
    create: jest.fn(),
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
  Application: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
  Appointment: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

const baseAppointmentData = {
  id: 1,
  date: "2026-09-06T10:00:00.000Z",
  reason: "Premier entretien téléphonique RH",
  status: AppointmentStatus.INCOMING,
  applicationId: 1,
  userId: 10,
};

const createMockAppointmentInstance = (data: any = baseAppointmentData) => {
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

describe("FUNCTIONAL TESTS - APPOINTMENT", () => {
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

  describe("GET /appointment/:id", () => {
    it("should return 200 and the appointment when it exists as admin", async () => {
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        date: "2026-09-06T10:00:00.000Z",
        reason: "Premier entretien téléphonique RH",
        status: AppointmentStatus.INCOMING,
        applicationId: 1,
        userId: 10,
      });
      expect(Appointment.findByPk).toHaveBeenCalledWith(1);
      expect(Appointment.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    });

    it("should return 200 when student requests their own appointment", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        userId: 10,
      });
    });

    it("should return 403 when student attempts to access another user's appointment", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(Appointment.findOne).not.toHaveBeenCalled();
    });

    it("should return 400 if appointment identifier is invalid", async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_URL}/invalid-id`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 400 if appointment identifier is zero or negative", async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_URL}/0`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 404 if appointment is not found", async () => {
      jest.mocked(Appointment.findByPk).mockResolvedValue(null);

      const res = await request(app)
        .get(`${APPOINTMENT_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Resource not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`${APPOINTMENT_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Appointment.findByPk)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Database verification failed" });
    });
  });

  describe("POST /appointment", () => {
    it("should return 201 and create appointment successfully as admin", async () => {
      const newAppointmentPayload = {
        date: "2026-09-13T14:30:00.000Z",
        reason: "Entretien technique et présentation des projets",
        status: AppointmentStatus.INCOMING,
        applicationId: 1,
        userId: 10,
      };
      const createdAppt = { id: 2, ...newAppointmentPayload };
      jest.mocked(Appointment.create).mockResolvedValue(createdAppt as any);

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send(newAppointmentPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdAppt);
      expect(Appointment.create).toHaveBeenCalledWith(newAppointmentPayload);
    });

    it("should return 201 and create appointment successfully as student", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const newAppointmentPayload = {
        date: "2026-09-18T16:00:00.000Z",
        reason: "Entretien final avec le tuteur d'entreprise & signature",
        status: AppointmentStatus.INCOMING,
        applicationId: 1,
      };
      const createdAppt = {
        id: 3,
        ...newAppointmentPayload,
        userId: 10,
      };
      jest.mocked(Appointment.create).mockResolvedValue(createdAppt as any);

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send(newAppointmentPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdAppt);
    });

    it("should return 201 when creating an appointment with FINISHED status", async () => {
      const finishedPayload = {
        date: "2026-09-01T10:00:00.000Z",
        reason: "Entretien RH passé",
        status: AppointmentStatus.FINISHED,
        applicationId: 1,
        userId: 10,
      };
      const createdAppt = { id: 4, ...finishedPayload };
      jest.mocked(Appointment.create).mockResolvedValue(createdAppt as any);

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send(finishedPayload);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(AppointmentStatus.FINISHED);
    });

    it("should return 403 when student attempts to create appointment for another user", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const payloadForOtherUser = {
        date: "2026-09-20T10:00:00.000Z",
        reason: "Tentative création pour un tiers",
        status: AppointmentStatus.INCOMING,
        applicationId: 1,
        userId: 99,
      };

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send(payloadForOtherUser);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message:
          "Access denied: you cannot create resources for another user.",
      });
      expect(Appointment.create).not.toHaveBeenCalled();
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .post(APPOINTMENT_URL)
        .send({ reason: "Entretien" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Appointment.create)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send({
          date: "2026-09-13T14:30:00.000Z",
          reason: "Entretien",
          status: AppointmentStatus.INCOMING,
          applicationId: 1,
          userId: 10,
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /appointment/:id", () => {
    it("should return 200 and update appointment as admin", async () => {
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { reason: "Entretien technique reporté" };
      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.reason).toBe("Entretien technique reporté");
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 200 and update appointment as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { reason: "Entretien validé par le staff" };
      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.reason).toBe("Entretien validé par le staff");
    });

    it("should return 200 when student updates their own appointment", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { date: "2026-09-08T14:00:00.000Z" };
      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.date).toBe("2026-09-08T14:00:00.000Z");
      expect(Appointment.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 403 when student attempts to update another user's appointment", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send({ reason: "Hack attempt" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.update).not.toHaveBeenCalled();
    });

    it("should return 400 if appointment identifier is invalid on PATCH", async () => {
      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/invalid-id`)
        .set(AUTH_HEADER)
        .send({ reason: "Test" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 404 if appointment is not found", async () => {
      jest.mocked(Appointment.findByPk).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/999`)
        .set(AUTH_HEADER)
        .send({ reason: "Non-existent" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Resource not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .send({ reason: "Updated" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Appointment.findByPk)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send({ reason: "Updated" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Database verification failed" });
    });
  });

  describe("DELETE /appointment/:id", () => {
    it("should return 204 and delete appointment as admin", async () => {
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 and delete appointment as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 when student deletes their own appointment", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Appointment.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(Appointment.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 403 when student attempts to delete another user's appointment", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockAppointmentInstance();
      jest.mocked(Appointment.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.destroy).not.toHaveBeenCalled();
    });

    it("should return 400 if appointment identifier is invalid on DELETE", async () => {
      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/invalid-id`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 404 if appointment is not found", async () => {
      jest.mocked(Appointment.findByPk).mockResolvedValue(null);

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Resource not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).delete(`${APPOINTMENT_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Appointment.findByPk)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Database verification failed" });
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 when rate limit is exceeded on POST /appointment", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .post(APPOINTMENT_URL)
        .set(AUTH_HEADER)
        .send({ reason: "Entretien" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on PATCH /appointment/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .patch(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER)
        .send({ reason: "Entretien reporté" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on DELETE /appointment/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .delete(`${APPOINTMENT_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });
  });
});
