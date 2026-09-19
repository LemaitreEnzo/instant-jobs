import type { PropsFormField } from "../../../types/props.type";
import Label from "../Label/Label";
import "./FormField.css";

const FormField = ({
  label,
  name,
  required = false,
  error,
  customClassName,
  children,
  ...props
}: PropsFormField) => {
  const finalClassName = ["form-field", error && "error", customClassName].join(" ").trim();
  return (
    <div className={finalClassName} {...props}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
