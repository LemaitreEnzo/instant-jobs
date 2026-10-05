import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

import { Campus, Organization, User } from "src/models";
import { OrganizationRole } from "../../models/enums/organization.enum";
import { UserRole } from "../../models/enums/user.enum";

import app from "../../../app";
import getEnv from "../../../utils/envHelper";

const VERSION = getEnv("VERSION");
const ORGANIZATION_URL = `/${VERSION}/organization`;

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
  Promotion: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Speciality: { hasMany: jest.fn(), belongsTo: jest.fn() },
  SubSpeciality: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Application: { hasMany: jest.fn(), belongsTo: jest.fn() },
  Appointment: { hasMany: jest.fn(), belongsTo: jest.fn() },
}));

const validBase64Logo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const baseSchoolData = {
  id: 1,
  name: "La Manu",
  email: "contact@lamanu.fr",
  phone: "0344000001",
  logo: validBase64Logo,
  role: OrganizationRole.SCHOOL,
  description:
    "École supérieure des métiers du numérique formant les futurs experts en développement web, data, cybersécurité et design digital.",
  postcode: 60200,
  city: "Compiègne",
  address: "70 rue des Jacobins",
  country: "France",
};

const baseCompanyData = {
  id: 2,
  name: "TechNova Solutions",
  email: "contact@technova.fr",
  phone: "0140000001",
  logo: validBase64Logo,
  role: OrganizationRole.COMPANY,
  description:
    "Entreprise spécialisée dans le développement de solutions logicielles SaaS et le conseil en transformation digitale pour les grands comptes et scale-ups.",
  postcode: 75008,
  city: "Paris",
  address: "25 rue de Ponthieu",
  country: "France",
};

const createMockOrganizationInstance = (data: any = baseSchoolData) => {
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

const mockCampuses = [
  { id: 1, name: "Campus Compiègne", organizationId: 1 },
  { id: 2, name: "Campus Amiens", organizationId: 1 },
  { id: 3, name: "Campus Noyon", organizationId: 1 },
];

const mockStudentUser = {
  id: 10,
  firstname: "Lucas",
  lastname: "Dubois",
  email: "lucas.dubois.10@lamanu.fr",
  phone: "0610000010",
  role: UserRole.STUDENT,
  organizationId: 1,
  medias: [
    { id: 1, name: "CV - Développeur Web", path: "/uploads/cv-dev-web.pdf" },
  ],
  campus: { id: 1, name: "Campus Compiègne" },
  promotion: {
    id: 1,
    name: "Promotion 2026 - Bachelor Développeur Full-Stack",
  },
  speciality: { id: 1, name: "Développement Web & Mobile" },
  subSpeciality: { id: 1, name: "Frontend React & Next.js" },
};

const mockStaffUser = {
  id: 11,
  firstname: "Sophie",
  lastname: "Bernard",
  email: "sophie.bernard.11@lamanu.fr",
  phone: "0610000011",
  role: UserRole.STAFF,
  organizationId: 1,
  medias: [],
  campus: { id: 1, name: "Campus Compiègne" },
};

const AUTH_HEADER = { Authorization: "Bearer test-valid-token" };

describe("FUNCTIONAL TESTS - ORGANIZATION", () => {
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

  describe("GET /organization", () => {
    it("should return 200 with all organizations", async () => {
      const schoolInstance = createMockOrganizationInstance(baseSchoolData);
      const companyInstance = createMockOrganizationInstance(baseCompanyData);

      jest
        .mocked(Organization.findAll)
        .mockResolvedValue([schoolInstance, companyInstance] as any);

      const res = await request(app)
        .get(ORGANIZATION_URL)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: 1,
        name: "La Manu",
        role: OrganizationRole.SCHOOL,
      });
      expect(res.body[1]).toMatchObject({
        id: 2,
        name: "TechNova Solutions",
        role: OrganizationRole.COMPANY,
      });
    });

    it("should return 200 with empty array if doesn't have any organization", async () => {
      jest.mocked(Organization.findAll).mockResolvedValue([] as any);

      const res = await request(app)
        .get(ORGANIZATION_URL)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 500 if there is a database error", async () => {
      jest
        .mocked(Organization.findAll)
        .mockRejectedValue(new Error("Database connection failure"));

      const res = await request(app)
        .get(ORGANIZATION_URL)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(ORGANIZATION_URL);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });
  });

  describe("GET /organization/:id", () => {
    it("should return 200 with one organization", async () => {
      const mockInstance = createMockOrganizationInstance();
      jest.mocked(Organization.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "La Manu",
        city: "Compiègne",
        role: OrganizationRole.SCHOOL,
      });
      expect(Organization.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1" },
        }),
      );
    });

    it("should return 404 if the organization doesn't exist", async () => {
      jest.mocked(Organization.findOne).mockResolvedValue(null);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Organization not found" });
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).get(`${ORGANIZATION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if there is a database error", async () => {
      jest
        .mocked(Organization.findOne)
        .mockRejectedValue(new Error("Database connection failure"));

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /organization", () => {
    const newOrganizationPayload = {
      name: "InnoWave Digital",
      email: "contact@innowave.io",
      phone: "0140000002",
      logo: validBase64Logo,
      role: OrganizationRole.COMPANY,
      description: "Agence d'ingénierie web et IA.",
      postcode: 69002,
      city: "Lyon",
      address: "14 quai du Commerce",
      country: "France",
    };

    it("should return 201 with the new organization when an admin creates it", async () => {
      const createdInstance = createMockOrganizationInstance({
        id: 3,
        ...newOrganizationPayload,
      });
      jest.mocked(Organization.create).mockResolvedValue(createdInstance as any);

      const res = await request(app)
        .post(ORGANIZATION_URL)
        .set(AUTH_HEADER)
        .send(newOrganizationPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 3,
        name: "InnoWave Digital",
        role: OrganizationRole.COMPANY,
      });
      expect(Organization.create).toHaveBeenCalledWith(newOrganizationPayload);
    });

    it("should return 403 if user role is “STAFF“", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const res = await request(app)
        .post(ORGANIZATION_URL)
        .set(AUTH_HEADER)
        .send(newOrganizationPayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.create).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .post(ORGANIZATION_URL)
        .set(AUTH_HEADER)
        .send(newOrganizationPayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.create).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app)
        .post(ORGANIZATION_URL)
        .send(newOrganizationPayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the creation fails", async () => {
      jest
        .mocked(Organization.create)
        .mockRejectedValue(new Error("SequelizeUniqueConstraintError"));

      const res = await request(app)
        .post(ORGANIZATION_URL)
        .set(AUTH_HEADER)
        .send(newOrganizationPayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PATCH /organization/:id", () => {
    const updatePayload = {
      name: "La Manu - Pôle Compiègne",
      city: "Compiègne Cedex",
    };

    it("should return 200 with the updated organization when an admin updates it", async () => {
      const mockInstance = createMockOrganizationInstance();
      jest.mocked(Organization.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: "La Manu - Pôle Compiègne",
        city: "Compiègne Cedex",
      });
      expect(mockInstance.update).toHaveBeenCalledWith(updatePayload);
    });

    it("should return 404 if the organization doesn't exist", async () => {
      jest.mocked(Organization.findOne).mockResolvedValue(null);

      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/999`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Organization not found" });
    });

    it("should return 403 if user role is “STAFF“", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.findOne).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.findOne).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/1`)
        .send(updatePayload);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the update fails", async () => {
      const mockInstance = createMockOrganizationInstance();
      mockInstance.update = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Update failed"));

      jest.mocked(Organization.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .patch(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER)
        .send(updatePayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /organization/:id", () => {
    it("should return 204 when an admin deletes an organization", async () => {
      const mockInstance = createMockOrganizationInstance();
      jest.mocked(Organization.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(204);
      expect(res.text).toBe("");
      expect(mockInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if the organization doesn't exist", async () => {
      jest.mocked(Organization.findOne).mockResolvedValue(null);

      const res = await request(app)
        .delete(`${ORGANIZATION_URL}/999`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Organization not found" });
    });

    it("should return 403 if user role is “STAFF“", async () => {
      currentUser = {
        id: 2,
        uuid: "00000000-0000-0000-0000-000000000002",
        role: UserRole.STAFF,
        organizationId: 1,
      };

      const res = await request(app)
        .delete(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.findOne).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is “STUDENT“", async () => {
      currentUser = {
        id: 3,
        uuid: "00000000-0000-0000-0000-000000000003",
        role: UserRole.STUDENT,
        organizationId: 1,
      };

      const res = await request(app)
        .delete(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Access denied: Insufficient privileges",
      });
      expect(Organization.findOne).not.toHaveBeenCalled();
    });

    it("should return 401 if the user isn't authenticated", async () => {
      const res = await request(app).delete(`${ORGANIZATION_URL}/1`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        message: "Unauthorized: Missing authentication token",
      });
    });

    it("should return 500 if the delete fails", async () => {
      const mockInstance = createMockOrganizationInstance();
      mockInstance.destroy = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Delete failed"));

      jest.mocked(Organization.findOne).mockResolvedValue(mockInstance as any);

      const res = await request(app)
        .delete(`${ORGANIZATION_URL}/1`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /organization/:organizationId/campuses", () => {
    it("should return 200 with all campuses of the organization", async () => {
      jest.mocked(Campus.findAll).mockResolvedValue(mockCampuses as any);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/campuses`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toMatchObject({
        id: 1,
        name: "Campus Compiègne",
        organizationId: 1,
      });
      expect(Campus.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId: "1" },
        }),
      );
    });

    it("should return 200 with empty array if no campus exists", async () => {
      jest.mocked(Campus.findAll).mockResolvedValue([]);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/campuses`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 500 if the campus search fails", async () => {
      jest
        .mocked(Campus.findAll)
        .mockRejectedValue(new Error("Database failure"));

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/campuses`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /organization/:organizationId/users", () => {
    it("should return 200 with all users of the organization", async () => {
      jest
        .mocked(User.findAll)
        .mockResolvedValueOnce([mockStudentUser] as any)
        .mockResolvedValueOnce([mockStaffUser] as any);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/users`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: 10,
        firstname: "Lucas",
        role: UserRole.STUDENT,
        campus: { name: "Campus Compiègne" },
      });
      expect(res.body[1]).toMatchObject({
        id: 11,
        firstname: "Sophie",
        role: UserRole.STAFF,
      });
      expect(User.findAll).toHaveBeenCalledTimes(2);
    });

    it("should return 200 with empty array if no user exists", async () => {
      jest
        .mocked(User.findAll)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/users`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 500 if the users search fails", async () => {
      jest
        .mocked(User.findAll)
        .mockRejectedValue(new Error("User Query Failed"));

      const res = await request(app)
        .get(`${ORGANIZATION_URL}/1/users`)
        .set(AUTH_HEADER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("Rate Limiting (customRateLimiter)", () => {
    it("should return 429 if the user exceeded the rate limit", async () => {
      triggerRateLimit = true;

      const res = await request(app)
        .get(ORGANIZATION_URL)
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
