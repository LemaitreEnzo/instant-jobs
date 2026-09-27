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
  promotionId: number | null;
  specialityId: number | null;
  subSpecialityId: number | null;
  status: StudentStatus;
}
