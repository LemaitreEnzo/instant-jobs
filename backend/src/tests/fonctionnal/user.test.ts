import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import request from "supertest";

import { Application, Appointment, Media, User } from "src/models";
import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { StudentStatus, UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const USER_URL = `/${VERSION}/user`;

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
    create: jest.fn(),
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

const AUTH_HEADER = { Authorization: "Bearer test-valid-token" };
const plainTestPassword = "Azerty1234*&";
const hashedTestPassword = bcrypt.hashSync(plainTestPassword, 10);

const mockAdminUser = {
  id: 1,
  uuid: "00000000-0000-0000-0000-000000000001",
  firstname: "Jean",
  lastname: "Dupont",
  email: "jean.dupont.1@lamanu.fr",
  phone: "0610000001",
  role: UserRole.ADMIN,
  status: null,
  organizationId: 1,
  password_hash: hashedTestPassword,
};

const mockStudentUser = {
  id: 10,
  uuid: "00000000-0000-0000-0000-000000000010",
  firstname: "Lucas",
  lastname: "Dubois",
  email: "lucas.dubois.10@lamanu.fr",
  phone: "0610000010",
  role: UserRole.STUDENT,
  status: StudentStatus.SEARCH,
  organizationId: 1,
  campusId: 1,
  password_hash: hashedTestPassword,
  medias: [{ id: 1, name: "CV - Développeur Web", path: "/uploads/cv.pdf" }],
  applications: [{ id: 1, title: "Alternance Développeur", status: "pending" }],
  appointments: [
    {
      id: 1,
      date: "2026-09-06T10:00:00.000Z",
      reason: "Premier entretien téléphonique RH",
      status: AppointmentStatus.INCOMING,
    },
  ],
  campus: { id: 1, name: "Campus Compiègne" },
};

const mockMedias = [
  { id: 1, name: "CV - Développeur Web", path: "/uploads/cv.pdf", userId: 10 },
  { id: 2, name: "Photo de profil", path: "/uploads/photo.jpg", userId: 10 },
];

const mockApplications = [
  {
    id: 1,
    title: "Alternance Développeur Full-Stack",
    status: "pending",
    type: "apprenticeship",
    userId: 10,
  },
  {
    id: 2,
    title: "Stage Frontend React",
    status: "accepted",
    type: "internship",
    userId: 10,
  },
];

const mockAppointments = [
  {
    id: 1,
    date: "2026-09-06T10:00:00.000Z",
    reason: "Premier entretien téléphonique RH",
    status: AppointmentStatus.INCOMING,
    applicationId: 1,
    userId: 10,
  },
];

const createMockUserInstance = (data: any) => {
  const instance: any = {
    ...data,
    dataValues: { ...data },
    get: jest.fn(() => {
      const copy = { ...data };

      return copy;
    }),
    update: jest.fn().mockImplementation(async (updateData: any) => {
      Object.assign(instance, updateData);
      Object.assign(instance.dataValues, updateData);

      return instance;
    }),
    destroy: jest.fn(),
  };

  return instance;
};

describe("FUNCTIONAL TESTS - USER", () => {
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

  describe("GET /user/:id", () => {
    it("should return 200 with one user", async () => {
      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).get(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 10,
        firstname: "Lucas",
        email: "lucas.dubois.10@lamanu.fr",
        role: UserRole.STUDENT,
      });
      expect(User.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "10" },
        }),
      );
    });

    it("should strip student-specific relations when requesting a non-student user", async () => {
      const staffWithExtraRelations = {
        ...mockAdminUser,
        applications: [{ id: 1 }],
        promotion: { id: 1 },
      };
      const mockInstance = createMockUserInstance(staffWithExtraRelations);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).get(`${USER_URL}/1`).set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body.applications).toBeUndefined();
      expect(res.body.promotion).toBeUndefined();
    });

    it("should return 404 if the user doesn't exist", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);

      const res = await request(app).get(`${USER_URL}/999`).set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${USER_URL}/10`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if there is a database error", async () => {
      jest
        .mocked(User.findOne)
        .mockRejectedValue(new Error("Database connection failure"));

      const res = await request(app).get(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /user", () => {
    const newUserPayload = {
      firstname: "Antoine",
      lastname: "Martin",
      email: "antoine.martin@lamanu.fr",
      phone: "0620000001",
      password: plainTestPassword,
      role: UserRole.STUDENT,
      status: StudentStatus.SEARCH,
      organizationId: 1,
    };

    it("should return 200 with the new user when an admin creates it", async () => {
      const { password, ...payloadWithoutPassword } = newUserPayload;
      const createdInstance = createMockUserInstance({
        id: 20,
        ...payloadWithoutPassword,
        password_hash: hashedTestPassword,
      });
      jest.mocked(User.create).mockResolvedValue(createdInstance as any);

      const res = await request(app)
        .post(USER_URL)
        .set(AUTH_HEADER)
        .send(newUserPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 20,
        firstname: "Antoine",
        email: "antoine.martin@lamanu.fr",
      });
      expect(res.body.password_hash).toBeUndefined();
      expect(User.create).toHaveBeenCalled();
    });

    it("should return 200 with the new user when a staff creates it", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const { password, ...payloadWithoutPassword } = newUserPayload;
      const createdInstance = createMockUserInstance({
        id: 20,
        ...payloadWithoutPassword,
        password_hash: hashedTestPassword,
      });
      jest.mocked(User.create).mockResolvedValue(createdInstance as any);

      const res = await request(app)
        .post(USER_URL)
        .set(AUTH_HEADER)
        .send(newUserPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 20,
        firstname: "Antoine",
      });
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .post(USER_URL)
        .set(AUTH_HEADER)
        .send(newUserPayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(User.create).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).post(USER_URL).send(newUserPayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the creation fails", async () => {
      jest
        .mocked(User.create)
        .mockRejectedValue(new Error("SequelizeUniqueConstraintError"));

      const res = await request(app)
        .post(USER_URL)
        .set(AUTH_HEADER)
        .send(newUserPayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /user/:id", () => {
    const updatePayload = {
      firstname: "Lucas Modifié",
      phone: "0699999999",
    };

    it("should return 200 when an admin updates any user", async () => {
      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${USER_URL}/10`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 10,
        firstname: "Lucas Modifié",
      });
      expect(mockInstance.update).toHaveBeenCalledWith(updatePayload);
    });

    it("should return 200 when a staff updates any user", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${USER_URL}/10`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 10,
        firstname: "Lucas Modifié",
      });
    });

    it("should return 200 when a student updates their own account", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${USER_URL}/10`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(mockInstance.update).toHaveBeenCalledWith(updatePayload);
    });

    it("should return 403 when a student tries to update another user account", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .patch(`${USER_URL}/11`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: a student can only modify their own account.",
      });
      expect(User.findOne).not.toHaveBeenCalled();
    });

    it("should return 404 if the user doesn't exist", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${USER_URL}/999`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app)
        .patch(`${USER_URL}/10`)
        .send(updatePayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the update fails", async () => {
      const mockInstance = {
        ...mockStudentUser,
        update: jest
          .fn<() => Promise<never>>()
          .mockRejectedValue(new Error("Update failed")),
      };
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${USER_URL}/10`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /user/:id", () => {
    it("should return 204 when an admin deletes a user", async () => {
      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(res.text).toBe("");
      expect(mockInstance.destroy).toHaveBeenCalled();
    });

    it("should return 204 when a staff deletes a user", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const mockInstance = createMockUserInstance(mockStudentUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(mockInstance.destroy).toHaveBeenCalled();
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 10,
        uuid: "00000000-0000-0000-0000-000000000010",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app).delete(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(User.findOne).not.toHaveBeenCalled();
    });

    it("should return 404 if the user doesn't exist", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);

      const res = await request(app).delete(`${USER_URL}/999`).set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).delete(`${USER_URL}/10`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the delete fails", async () => {
      const mockInstance = {
        ...mockStudentUser,
        destroy: jest
          .fn<() => Promise<never>>()
          .mockRejectedValue(new Error("Delete failed")),
      };
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).delete(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /user/:userId/medias", () => {
    it("should return 200 with all medias of the user", async () => {
      jest.mocked(Media.findAll).mockResolvedValue(mockMedias as any);

      const res = await request(app)
        .get(`${USER_URL}/10/medias`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: 1,
        name: "CV - Développeur Web",
      });
      expect(Media.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "10" },
        }),
      );
    });

    it("should return 200 with empty array if no media exists", async () => {
      jest.mocked(Media.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${USER_URL}/10/medias`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 403 when student attempts to access another user's medias", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };

      const res = await request(app)
        .get(`${USER_URL}/10/medias`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: a student can only modify their own account.",
      });
      expect(Media.findAll).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${USER_URL}/10/medias`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the medias search fails", async () => {
      jest
        .mocked(Media.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${USER_URL}/10/medias`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /user/:userId/applications", () => {
    it("should return 200 with all applications of the user", async () => {
      jest
        .mocked(Application.findAll)
        .mockResolvedValue(mockApplications as any);

      const res = await request(app)
        .get(`${USER_URL}/10/applications`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: 1,
        title: "Alternance Développeur Full-Stack",
      });
    });

    it("should return 200 with empty array if no application exists", async () => {
      jest.mocked(Application.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${USER_URL}/10/applications`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 403 when student attempts to access another user's applications", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };

      const res = await request(app)
        .get(`${USER_URL}/10/applications`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: a student can only modify their own account.",
      });
      expect(Application.findAll).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${USER_URL}/10/applications`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the applications search fails", async () => {
      jest
        .mocked(Application.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${USER_URL}/10/applications`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /user/:userId/appointments", () => {
    it("should return 200 with all appointments of the user", async () => {
      jest
        .mocked(Appointment.findAll)
        .mockResolvedValue(mockAppointments as any);

      const res = await request(app)
        .get(`${USER_URL}/10/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        id: 1,
        reason: "Premier entretien téléphonique RH",
        status: AppointmentStatus.INCOMING,
      });
      expect(Appointment.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "10" },
        }),
      );
    });

    it("should return 200 with empty array if no appointment exists", async () => {
      jest.mocked(Appointment.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${USER_URL}/10/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 403 when student attempts to access another user's appointments", async () => {
      currentUser = {
        id: 99,
        uuid: "00000000-0000-0000-0000-000000000099",
        role: UserRole.STUDENT,
      };

      const res = await request(app)
        .get(`${USER_URL}/10/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: a student can only modify their own account.",
      });
      expect(Appointment.findAll).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${USER_URL}/10/appointments`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the appointments search fails", async () => {
      jest
        .mocked(Appointment.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${USER_URL}/10/appointments`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /user/login", () => {
    it("should return 200 with user data and set cookie when credentials are valid", async () => {
      const mockInstance = createMockUserInstance(mockAdminUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).post(`${USER_URL}/login`).send({
        email: "jean.dupont.1@lamanu.fr",
        password: plainTestPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        email: "jean.dupont.1@lamanu.fr",
        role: UserRole.ADMIN,
      });
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 if password check fails", async () => {
      const mockInstance = createMockUserInstance(mockAdminUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app).post(`${USER_URL}/login`).send({
        email: "jean.dupont.1@lamanu.fr",
        password: "WrongPassword!",
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid email or password" });
    });

    it("should return 401 if user email is not found", async () => {
      jest.mocked(User.findOne).mockResolvedValue(null);

      const res = await request(app).post(`${USER_URL}/login`).send({
        email: "notfound@lamanu.fr",
        password: plainTestPassword,
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid email or password" });
    });

    it("should return 500 if an internal error occurs during login", async () => {
      jest
        .mocked(User.findOne)
        .mockRejectedValue(new Error("Database crash during login"));

      const res = await request(app).post(`${USER_URL}/login`).send({
        email: "jean.dupont.1@lamanu.fr",
        password: plainTestPassword,
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /user/logout", () => {
    it("should return 200 and clear the token cookie", async () => {
      const res = await request(app).post(`${USER_URL}/logout`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Successfully logged out" });
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /user/me", () => {
    it("should return 200 with current user data when token cookie is valid", async () => {
      const secret = getEnv("SECRET");
      const tokenName = getEnv("TOKEN");
      const token = jwt.sign(
        {
          id: 1,
          uuid: mockAdminUser.uuid,
          role: UserRole.ADMIN,
          organizationId: 1,
        },
        secret,
      );

      const mockInstance = createMockUserInstance(mockAdminUser);
      jest.mocked(User.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${USER_URL}/me`)
        .set("Cookie", [`${tokenName}=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        uuid: mockAdminUser.uuid,
        email: "jean.dupont.1@lamanu.fr",
      });
    });

    it("should return 200 with null if no cookie is provided", async () => {
      const res = await request(app).get(`${USER_URL}/me`);

      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });

    it("should return 200 with null if token verification fails", async () => {
      const tokenName = getEnv("TOKEN");
      const res = await request(app)
        .get(`${USER_URL}/me`)
        .set("Cookie", [`${tokenName}=invalid-malformed-token`]);

      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 if the user exceeded the rate limit", async () => {
      triggerRateLimit = true;

      const res = await request(app).get(`${USER_URL}/10`).set(AUTH_HEADER);

      expect(res.status).toBe(429);
      expect(res.body).toMatchObject({
        error: "Too many requests",
        message: expect.stringContaining("You have exceeded the rate limit"),
        retryAfter: expect.any(Number),
      });
    });
  });
});
