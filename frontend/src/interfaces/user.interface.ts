import type { StudentStatus, UserRole } from "../types/enum.type";
import type {
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
  campus: Campus | null;
}

export interface Student extends User {
  promotion: Promotion | null;
  speciality: Speciality | null;
  subSpeciality: SubSpeciality | null;
  status: StudentStatus;
}
