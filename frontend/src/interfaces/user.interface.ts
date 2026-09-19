import type { StudentStatus } from "../types/enum.type";
import type { Role } from "../types/global.type";
import type {
  Application,
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
  role: Role;
  medias: Media[] | null;
  organizationId: string;
  campusId: string | null;
}

export interface Student extends User {
  campus: Campus | null;
  promotion: Promotion | null;
  speciality: Speciality | null;
  subSpeciality: SubSpeciality | null;
  applications: Application[];
  status: StudentStatus;
}
