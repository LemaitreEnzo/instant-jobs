import type { StudentStatus, UserRole } from "../types/enum.type";
import type {
  Application,
  Appointment,
  Campus,
  Media,
  Promotion,
  Speciality,
  SubSpeciality,
} from "./models.interface";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: UserRole;
  medias: Media[] | null;
  organizationId: string;
}

export interface Staff extends User {
  campus: Campus;
}

export interface Student extends User {
  campus: Campus;
  applications: Application[] | null;
  appointments: Appointment[] | null;
  promotion: Promotion;
  speciality: Speciality | null;
  subSpeciality: SubSpeciality | null;
  status: StudentStatus;
}
