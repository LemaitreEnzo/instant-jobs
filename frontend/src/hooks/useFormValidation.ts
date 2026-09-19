import { useState, useCallback } from 'react';

export const validators = {
  required: (message = 'Ce champ est obligatoire') => (value) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return message;
    }
    return null;
  },

  email: (message = 'Adresse email invalide') => (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  minLength: (length: number, message: string) => (value) => {
    if (!value) return null;
    return value.length >= length ? null : (message || `Minimum ${length} caractères requis`);
  },

  maxLength: (length: number, message: string) => (value) => {
    if (!value) return null;
    return value.length <= length ? null : (message || `Maximum ${length} caractères autorisés`);
  }
};

export const useFormValidation = (schema: object) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName: string, value, formData: object) => {
    const fieldValidators = schema[fieldName];
    if (!fieldValidators) return null;

    for (const validator of fieldValidators) {
      const error = validator(value, formData);
      if (error) return error;
    }
    return null;
  }, [schema]);

  const validate = useCallback((formData: object) => {
    const newErrors = {};
    let isValid = true;

    for (const fieldName of Object.keys(schema)) {
      const error = validateField(fieldName, formData[fieldName], formData);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    const allTouched = Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    return isValid;
  }, [schema, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const hasError = useCallback((fieldName: string) => {
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  const getError = useCallback((fieldName: string) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [errors, touched]);

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
