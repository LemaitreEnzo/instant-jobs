import { BASE_URL } from "../constants/global.constant";
import type {
  Application,
  Campus,
  Media,
  Organization,
  Promotion,
  Speciality,
  SubSpeciality,
} from "../interfaces/models.interface";
import type { Student, User } from "../interfaces/user.interface";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = BASE_URL, timeout: number = 8000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      headers: customHeaders,
      body,
      signal,
      ...restOptions
    } = options;

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(customHeaders as Record<string, string>),
    };

    let finalBody: BodyInit | null | undefined = undefined;

    if (body !== undefined && body !== null) {
      if (body instanceof FormData) {
        finalBody = body;
        delete headers["Content-Type"];
      } else if (typeof body === "string") {
        finalBody = body;
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      } else {
        headers["Content-Type"] = "application/json";
        finalBody = JSON.stringify(body);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body: finalBody,
        credentials: "include", // Always send HTTP-Only cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return undefined as T;
      }

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          try {
            errorData = await response.text();
          } catch {
            errorData = null;
          }
        }

        let errorMessage = "An unexpected error occurred";
        if (typeof errorData === "string" && errorData.trim().length > 0) {
          errorMessage = errorData;
        } else if (
          errorData &&
          typeof errorData === "object" &&
          "message" in errorData &&
          typeof (errorData as { message: unknown }).message === "string"
        ) {
          errorMessage = (errorData as { message: string }).message;
        } else if (
          errorData &&
          typeof errorData === "object" &&
          "error" in errorData &&
          typeof (errorData as { error: unknown }).error === "string"
        ) {
          errorMessage = (errorData as { error: string }).error;
        } else {
          switch (response.status) {
            case 400:
              errorMessage = "Bad request.";
              break;
            case 401:
              errorMessage = "Session expired or unauthorized. Please log in again.";
              break;
            case 403:
              errorMessage = "Access denied.";
              break;
            case 404:
              errorMessage = "Resource not found.";
              break;
            case 408:
              errorMessage = "Request timeout.";
              break;
            case 409:
              errorMessage = "Conflict with the current state of the resource.";
              break;
            case 422:
              errorMessage = "Unprocessable entity.";
              break;
            case 500:
            case 502:
            case 503:
            case 504:
              errorMessage = "Internal server error.";
              break;
            default:
              errorMessage = `HTTP error ${response.status}`;
              break;
          }
        }

        throw new ApiError(response.status, errorMessage, errorData);
      }

      const data = await response.json();
      return data as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        throw new ApiError(408, "Request timed out");
      }

      const message =
        error instanceof Error ? error.message : "Server connection error";
      throw new ApiError(0, message, error);
    }
  }

  readonly organization = {
    fetch: (): Promise<Organization[]> => {
      return this.request<Organization[]>("organization", { method: "GET" });
    },

    fetchOne: (id: string | number): Promise<Organization> => {
      return this.request<Organization>(`organization/${id}`, {
        method: "GET",
      });
    },

    create: (data: Partial<Organization>): Promise<Organization> => {
      return this.request<Organization>("organization", {
        method: "POST",
        body: data,
      });
    },

    update: (id: number, data: Partial<Organization>): Promise<Organization> => {
      return this.request<Organization>(`organization/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: string | number): Promise<void> => {
      return this.request<void>(`organization/${id}`, { method: "DELETE" });
    },

    fetchCampuses: (organizationId: number): Promise<Campus[]> => {
      return this.request<Campus[]>(`organization/${organizationId}/campus`, {
        method: "GET",
      });
    },

    fetchUsers: (organizationId: number): Promise<User[]> => {
      return this.request<User[]>(`organization/${organizationId}/users`, {
        method: "GET",
      });
    },
  };

  readonly campus = {
    fetchOne: (id: number): Promise<Campus> => {
      return this.request<Campus>(`campus/${id}`, { method: "GET" });
    },

    create: (data: Partial<Campus>): Promise<Campus> => {
      return this.request<Campus>("campus", { method: "POST", body: data });
    },

    update: (id: number, data: Partial<Campus>): Promise<Campus> => {
      return this.request<Campus>(`campus/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`campus/${id}`, { method: "DELETE" });
    },

    fetchPromotions: (campusId: number): Promise<Promotion[]> => {
      return this.request<Promotion[]>(`campus/${campusId}/promotions`, {
        method: "GET",
      });
    },
  };

  readonly promotion = {
    fetchOne: (id: number): Promise<Promotion> => {
      return this.request<Promotion>(`promotion/${id}`, { method: "GET" });
    },

    create: (data: Partial<Promotion>): Promise<Promotion> => {
      return this.request<Promotion>("promotion", {
        method: "POST",
        body: data,
      });
    },

    update: (id: number, data: Partial<Promotion>): Promise<Promotion> => {
      return this.request<Promotion>(`promotion/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`promotion/${id}`, { method: "DELETE" });
    },

    fetchSpecialities: (promotionId: number): Promise<Speciality[]> => {
      return this.request<Speciality[]>(`promotion/${promotionId}/specialities`, {
        method: "GET",
      });
    },
  };

  readonly speciality = {
    fetchOne: (id: number): Promise<Speciality> => {
      return this.request<Speciality>(`speciality/${id}`, { method: "GET" });
    },

    create: (data: Partial<Speciality>): Promise<Speciality> => {
      return this.request<Speciality>("speciality", {
        method: "POST",
        body: data,
      });
    },

    update: (id: number, data: Partial<Speciality>): Promise<Speciality> => {
      return this.request<Speciality>(`speciality/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`speciality/${id}`, { method: "DELETE" });
    },

    fetchSubSpecialities: (specialityId: number): Promise<SubSpeciality[]> => {
      return this.request<SubSpeciality[]>(
        `speciality/${specialityId}/sub-specialities`,
        { method: "GET" },
      );
    },
  };

  readonly subSpeciality = {
    fetchOne: (id: number): Promise<SubSpeciality> => {
      return this.request<SubSpeciality>(`sub-speciality/${id}`, {
        method: "GET",
      });
    },

    create: (data: Partial<SubSpeciality>): Promise<SubSpeciality> => {
      return this.request<SubSpeciality>("sub-speciality", {
        method: "POST",
        body: data,
      });
    },

    update: (
      id: number,
      data: Partial<SubSpeciality>,
    ): Promise<SubSpeciality> => {
      return this.request<SubSpeciality>(`sub-speciality/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`sub-speciality/${id}`, { method: "DELETE" });
    },
  };

  readonly user = {
    fetchOne: (id: number): Promise<User | Student> => {
      return this.request<User | Student>(`user/${id}`, { method: "GET" });
    },

    create: (data: Partial<User>): Promise<User> => {
      return this.request<User>("user", { method: "POST", body: data });
    },

    update: (id: number, data: Partial<User>): Promise<User> => {
      return this.request<User>(`user/${id}`, { method: "PATCH", body: data });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`user/${id}`, { method: "DELETE" });
    },

    login: (
      credentials: { email: string; password: string } | Partial<User>,
    ): Promise<User | Student> => {
      return this.request<User | Student>("user/login", {
        method: "POST",
        body: credentials,
      });
    },

    logout: (): Promise<void> => {
      return this.request<void>("user/logout", { method: "POST" });
    },

    getMe: (): Promise<User | Student | null> => {
      return this.request<User | Student | null>("user/me", { method: "GET" });
    },

    fetchApplications: (userId: number, limit: number): Promise<Application[]> => {
      return this.request<Application[]>(`user/${userId}/applications?limit=${limit}`, {
        method: "GET",
      });
    },

    fetchMedias: (userId: number): Promise<Media[]> => {
      return this.request<Media[]>(`user/${userId}/medias`, { method: "GET" });
    },
  };

  readonly application = {
    fetchOne: (id: number): Promise<Application> => {
      return this.request<Application>(`application/${id}`, { method: "GET" });
    },

    create: (data: Partial<Application>): Promise<Application> => {
      return this.request<Application>("application", {
        method: "POST",
        body: data,
      });
    },

    update: (id: number, data: Partial<Application>): Promise<Application> => {
      return this.request<Application>(`application/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`application/${id}`, { method: "DELETE" });
    },
  };

  readonly media = {
    fetchOne: (id: number): Promise<Media> => {
      return this.request<Media>(`media/${id}`, { method: "GET" });
    },

    create: (data: Partial<Media> | FormData): Promise<Media> => {
      return this.request<Media>("media", { method: "POST", body: data });
    },

    update: (id: number, data: Partial<Media>): Promise<Media> => {
      return this.request<Media>(`media/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    delete: (id: number): Promise<void> => {
      return this.request<void>(`media/${id}`, { method: "DELETE" });
    },
  };
}

export const api = new ApiClient();
