import type { PropsCheckbox } from "../../../types/props.type";
import "./Checkbox.css";

const Checkbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  customClassName = "",
}: PropsCheckbox) => {
  const inputId = id || (name ? `checkbox-${name}` : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label
      htmlFor={inputId}
      className={`checkbox-container ${disabled ? "checkbox-disabled" : ""} ${customClassName}`.trim()}
    >
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="checkbox-input"
      />
      <span className="checkbox-box" aria-hidden="true">
        {checked && (
          <svg
            className="checkbox-icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3334 4L6.00008 11.3333L2.66675 8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default Checkbox;
