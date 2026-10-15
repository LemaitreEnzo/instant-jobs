import type React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
  customClassName?: string;
}

const Input: React.FC<InputProps> = ({ type, error, customClassName, ...props }) => {
  const finalClassName = ["input", customClassName].filter(Boolean).join(" ").trim();
  return (
    <input
      type={type}
      className={finalClassName}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
};
export default Input;
