import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

import { Application, Appointment } from "src/models";
import {
  ApplicationResend,
  ApplicationStatus,
  ApplicationType,
} from "../../models/enums/application.enum";
import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const APPLICATION_URL = `/${VERSION}/application`;

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
              console.error(error);

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

const baseApplicationData = {
  id: 1,
  title: "Développeur Full-Stack React / Node.js",
  type: ApplicationType.APPRENTICESHIP,
  logo: "logo-technova.png",
  company: "TechNova Solutions",
  city: "Paris",
  date: "2026-09-01",
  status: ApplicationStatus.PENDING,
  resend: ApplicationResend.NO,
  description:
    "Poste de développeur full-stack au sein de l'équipe produit SaaS.",
  userId: 10,
};

const createMockApplicationInstance = (data: any = baseApplicationData) => {
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

const mockAppointments = [
  {
    id: 1,
    date: new Date("2026-09-06T10:00:00.000Z"),
    reason: "Premier entretien téléphonique RH",
    status: AppointmentStatus.INCOMING,
    userId: 10,
  },
  {
    id: 2,
    date: new Date("2026-09-13T14:30:00.000Z"),
    reason: "Entretien technique et présentation des projets",
    status: AppointmentStatus.INCOMING,
    userId: 10,
  },
];

describe("FUNCTIONAL TESTS - APPLICATION", () => {
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

  describe("GET /application/:id", () => {
    it("should return 200 and the application when it exists", async () => {
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        title: "Développeur Full-Stack React / Node.js",
        type: ApplicationType.APPRENTICESHIP,
        logo: "logo-technova.png",
        company: "TechNova Solutions",
        city: "Paris",
        date: "2026-09-01",
        status: ApplicationStatus.PENDING,
        resend: ApplicationResend.NO,
        description:
          "Poste de développeur full-stack au sein de l'équipe produit SaaS.",
        userId: 10,
      });
      expect(Application.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    });

    it("should return 404 if application is not found", async () => {
      jest.mocked(Application.findOne).mockResolvedValue(null);

      const res = await request(app)
        .get(`${APPLICATION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Application not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`${APPLICATION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Application.findOne)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /application", () => {
    it("should return 201 and create application successfully as admin", async () => {
      const newApplicationPayload = {
        title: "Stage Développeur Frontend Next.js",
        type: ApplicationType.INTERNSHIP,
        logo: "logo-innowave.png",
        company: "InnoWave Digital",
        city: "Lyon",
        date: "2026-08-15",
        status: ApplicationStatus.ACCEPTED,
        resend: ApplicationResend.INTERVIEW_COMPLETED,
        description:
          "Stage de fin d'études en intégration web et optimisation de performance.",
        userId: 10,
      };
      const createdApp = { id: 2, ...newApplicationPayload };
      jest.mocked(Application.create).mockResolvedValue(createdApp as any);

      const res = await request(app)
        .post(APPLICATION_URL)
        .set(AUTH_HEADER)
        .send(newApplicationPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdApp);
      expect(Application.create).toHaveBeenCalledWith(newApplicationPayload);
    });

    it("should return 201 and create application successfully as student", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const newApplicationPayload = {
        title: "Alternance Data Engineer",
        type: ApplicationType.APPRENTICESHIP,
        logo: "logo-nexora.png",
        company: "Nexora Conseil",
        city: "Lille",
        date: "2026-09-10",
        status: ApplicationStatus.PENDING,
        resend: ApplicationResend.FOLLOW_UP,
        description: "Création et maintenance de pipelines ETL temps-réel.",
        userId: 10,
      };
      const createdApp = { id: 3, ...newApplicationPayload };
      jest.mocked(Application.create).mockResolvedValue(createdApp as any);

      const res = await request(app)
        .post(APPLICATION_URL)
        .set(AUTH_HEADER)
        .send(newApplicationPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdApp);
    });

    it("should return 403 when student attempts to create application for another user", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const payloadForOtherUser = {
        title: "Stage Frontend",
        type: ApplicationType.INTERNSHIP,
        logo: "logo.png",
        company: "Other Company",
        city: "Paris",
        date: "2026-09-10",
        status: ApplicationStatus.PENDING,
        resend: ApplicationResend.NO,
        description: "Description",
        userId: 99,
      };

      const res = await request(app)
        .post(APPLICATION_URL)
        .set(AUTH_HEADER)
        .send(payloadForOtherUser);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you cannot create resources for another user.",
      });
      expect(Application.create).not.toHaveBeenCalled();
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .post(APPLICATION_URL)
        .send({ title: "Candidature" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Application.create)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .post(APPLICATION_URL)
        .set(AUTH_HEADER)
        .send({ title: "Candidature" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /application/:id", () => {
    it("should return 200 and update application as admin", async () => {
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const updateData = {
        title: "Lead Développeur Full-Stack React / Node.js",
        status: ApplicationStatus.ACCEPTED,
      };
      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(
        "Lead Développeur Full-Stack React / Node.js",
      );
      expect(res.body.status).toBe(ApplicationStatus.ACCEPTED);
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 200 and update application as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { city: "Lyon" };
      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.city).toBe("Lyon");
    });

    it("should return 200 when student updates their own application", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const updateData = { resend: ApplicationResend.FOLLOW_UP };
      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.resend).toBe(ApplicationResend.FOLLOW_UP);
      expect(Application.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.update).toHaveBeenCalledWith(updateData);
    });

    it("should return 403 when student attempts to update another user's application", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send({ title: "Hack attempt" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.update).not.toHaveBeenCalled();
    });

    it("should return 400 if application identifier is invalid on PATCH", async () => {
      const res = await request(app)
        .patch(`${APPLICATION_URL}/invalid-id`)
        .set(AUTH_HEADER)
        .send({ title: "Test" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 404 if application is not found", async () => {
      jest.mocked(Application.findByPk).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${APPLICATION_URL}/999`)
        .set(AUTH_HEADER)
        .send({ title: "Non-existent" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Resource not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .send({ title: "Updated" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Application.findByPk)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send({ title: "Updated" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Database verification failed" });
    });
  });

  describe("DELETE /application/:id", () => {
    it("should return 204 and delete application as admin", async () => {
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 and delete application as staff", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 204 when student deletes their own application", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);
      jest.mocked(Application.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(Application.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 403 when student attempts to delete another user's application", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };
      const mockInstance = createMockApplicationInstance();
      jest.mocked(Application.findByPk).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: you can only access your own resources.",
      });
      expect(mockInstance.destroy).not.toHaveBeenCalled();
    });

    it("should return 400 if application identifier is invalid on DELETE", async () => {
      const res = await request(app)
        .delete(`${APPLICATION_URL}/invalid-id`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid resource identifier" });
    });

    it("should return 404 if application is not found", async () => {
      jest.mocked(Application.findByPk).mockResolvedValue(null);

      const res = await request(app)
        .delete(`${APPLICATION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Resource not found" });
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).delete(`${APPLICATION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Application.findByPk)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Database verification failed" });
    });
  });

  describe("GET /application/:applicationId/appointments", () => {
    it("should return 200 and list of appointments for the application", async () => {
      jest
        .mocked(Appointment.findAll)
        .mockResolvedValue(mockAppointments as any);

      const res = await request(app)
        .get(`${APPLICATION_URL}/1/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          date: "2026-09-06T10:00:00.000Z",
          reason: "Premier entretien téléphonique RH",
          status: AppointmentStatus.INCOMING,
          userId: 10,
        },
        {
          id: 2,
          date: "2026-09-13T14:30:00.000Z",
          reason: "Entretien technique et présentation des projets",
          status: AppointmentStatus.INCOMING,
          userId: 10,
        },
      ]);
      expect(Appointment.findAll).toHaveBeenCalledWith({
        where: { applicationId: "1" },
        attributes: {
          exclude: ["createdAt", "updatedAt", "applicationId"],
        },
      });
    });

    it("should return 200 and empty array when no appointments exist", async () => {
      jest.mocked(Appointment.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${APPLICATION_URL}/1/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`${APPLICATION_URL}/1/appointments`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 on database error", async () => {
      jest
        .mocked(Appointment.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${APPLICATION_URL}/1/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 when rate limit is exceeded on POST /application", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .post(APPLICATION_URL)
        .set(AUTH_HEADER)
        .send({ title: "Candidature" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on PATCH /application/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .patch(`${APPLICATION_URL}/1`)
        .set(AUTH_HEADER)
        .send({ title: "Candidature mise à jour" });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Try again in 60 seconds.",
        retryAfter: 60,
      });
    });

    it("should return 429 when rate limit is exceeded on DELETE /application/:id", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .delete(`${APPLICATION_URL}/1`)
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
