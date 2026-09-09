import type { StudentStatus } from "../types/enum.type";
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
  media: Media[] | null;
  organizationid: string;
  campusid: string | null;
}

export interface Student extends User {
  campus: Campus | null;
  promotion: Promotion | null;
  speciality: Speciality | null;
  subSpeciality: SubSpeciality | null;
  application: Application[];
  status: StudentStatus;
}
