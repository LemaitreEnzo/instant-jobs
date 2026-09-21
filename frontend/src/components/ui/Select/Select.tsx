import type { PropsSelect } from "../../../types/props.type";
import "./Select.css";

const Select = ({
  options,
  error,
  customClassName,
  children,
  ...props
}: PropsSelect) => {
  const finalClassName = ["select", customClassName].join(" ").trim();

  return (
    <select
      className={finalClassName}
      aria-invalid={error ? "true" : undefined}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))
      }
    </select>
  );
};

export default Select;