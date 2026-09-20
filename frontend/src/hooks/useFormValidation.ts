import { useCallback, useState } from "react";
import type {
  FieldValue,
  FormData,
  FormErrors,
  TouchedFields,
  ValidationSchema,
  ValidatorFn,
} from "../types/form.type";

export const validators = {
  required:
    (message = "Ce champ est obligatoire"): ValidatorFn =>
    (value) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return message;
      }
      return null;
    },

  email:
    (message = "Adresse email invalide"): ValidatorFn =>
    (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value)) ? null : message;
    },

  minLength:
    (length: number, message: string): ValidatorFn =>
    (value) => {
      if (!value) return null;
      const len = Array.isArray(value) ? value.length : String(value).length;
      return len >= length
        ? null
        : message || `Minimum ${length} caractères requis`;
    },

  maxLength:
    (length: number, message: string): ValidatorFn =>
    (value) => {
      if (!value) return null;
      const len = Array.isArray(value) ? value.length : String(value).length;
      return len <= length
        ? null
        : message || `Maximum ${length} caractères autorisés`;
    },
};

export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validateField = useCallback(
    (
      fieldName: string,
      value: FieldValue,
      formData: FormData,
    ): string | null => {
      const fieldValidators = schema[fieldName];
      if (!fieldValidators) return null;

      for (const validator of fieldValidators) {
        const error = validator(value, formData);
        if (error) return error;
      }
      return null;
    },
    [schema],
  );

  const validate = useCallback(
    (formData: FormData): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      for (const fieldName of Object.keys(schema)) {
        const error = validateField(fieldName, formData[fieldName], formData);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }

      setErrors(newErrors);
      const allTouched = Object.keys(schema).reduce<TouchedFields>(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      setTouched(allTouched);

      return isValid;
    },
    [schema, validateField],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const hasError = useCallback(
    (fieldName: string): boolean => {
      return !!touched[fieldName] && !!errors[fieldName];
    },
    [errors, touched],
  );

  const getError = useCallback(
    (fieldName: string): string | null => {
      return touched[fieldName] ? (errors[fieldName] ?? null) : null;
    },
    [errors, touched],
  );

  return {
    errors,
    touched,
    validate,
    validateField,
    clearErrors,
    hasError,
    getError,
    isValid: Object.keys(errors).length === 0,
  };
};

export default useFormValidation;
