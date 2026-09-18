import type { ApplicationStatus } from "../types/enum.type";

export interface Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  postcode: number;
  city: string;
  adress: string;
  country: string;
}

export interface Campus {
  id: number;
  name: string;
  organizationId: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  organizationId: string;
  campusId: string | null;
}

export interface Application {
  id: number;
  title: string;
  type: string;
  logo: string;
  company: string;
  city: string;
  date: string;
  status: ApplicationStatus;
  resend: string;
  description: string;
  userId: number | null;
}

export interface Media {
  id: number;
  name: string;
  path: string;
  userId: number;
}

export interface Promotion {
  id: number;
  name: string;
  campusId: string;
}

export interface Speciality {
  id: number;
  name: string;
  promotionId: string;
}

export interface SubSpeciality {
  id: number;
  name: string;
  specialityId: string;
}
