import type { Status } from "../types/enum.type";

import type {
  Campus,
  Promotion,
  Speciality,
  SubSpeciality,
} from "../types/models.type";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  organisation_id: number;
}

export interface Student extends User {
  campus: Campus;
  promotion: Promotion;
  speciality: Speciality;
  subSpeciality: SubSpeciality;
  status: Status;
}
