import type { StudentStatus, UserRole } from "../types/enum.type";
import type {
  Media,
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
  campusId: string | null;
}

export interface Student extends User {
  promotionId: number | null;
  specialityId: number | null;
  subSpecialityId: number | null;
  status: StudentStatus;
}
