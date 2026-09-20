export type dataLogin = {
  email: string;
  password: string;
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
