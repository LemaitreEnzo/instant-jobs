import { ApplicationStatus } from "./enum.type";

export type dataLogin = {
  email: string;
  password: string;
};

export type dataApplication = {
  title: string;
  logo: string;
  company: string;
  city: string;
  status: ApplicationStatus;
  type: string;
  description: string;
  date: string;
  resend: string;
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
