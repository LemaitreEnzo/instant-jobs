import {
  ApplicationResend,
  ApplicationStatus,
  ApplicationType,
  StudentStatus,
  UserRole,
} from "./enum.type";

export type dataLogin = {
  email: string;
  password: string;
};

export type dataApplication = {
  title: string;
  logo: string;
  company: string;
  city: string;
  status?: ApplicationStatus;
  type?: ApplicationType;
  description: string;
  date?: string;
  resend?: ApplicationResend;
};

export type dataMedia = {
  name: string;
  path: string;
};

export type dataUser = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: StudentStatus | null;
  organizationId: number;
  campusId: number | null;
  promotionId: number | null;
  specialityId: number | null;
  subSpecialityId: number | null;
};

export type FieldValue =
  | string
  | number
  | boolean
  | unknown[]
  | null
  | undefined;

export type FormData = Record<string, FieldValue>;

export type ValidatorFn = (
  value: FieldValue,
  formData?: FormData,
) => string | null;

export type ValidationSchema = Record<string, ValidatorFn[]>;

export type FormErrors = Record<string, string>;

export type TouchedFields = Record<string, boolean>;
