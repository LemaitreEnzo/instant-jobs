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
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: number;
  name: string;
  id: string;
  organizationid: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  organizationid: string;
  campusid: string | null;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  name: string;
  path: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: number;
  id: string;
  name: string;
  campusid: string;
  createdAt: string;
  updatedAt: string;
}

export interface Speciality {
  id: number;
  id: string;
  name: string;
  promotionid: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubSpeciality {
  id: number;
  name: string;
  id: string;
  specialityid: string;
  createdAt: string;
  updatedAt: string;
}
