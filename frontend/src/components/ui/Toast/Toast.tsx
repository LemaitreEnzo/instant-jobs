import type { PropsToast } from "../../../types/props.type";
import "./Toast.css";

/** Visual toast notification component with ARIA accessibility roles and dismiss controls. */
const Toast = ({
  title,
  description,
  className = "toast-none",
  customClassName,
  isExiting,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: PropsToast) => {
  const finalClassName = [
    "toast",
    className,
    isExiting ? "toast-exit" : "",
    customClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const isAlert = className === "toast-error";

  return (
    <div
      className={finalClassName}
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="toast-content">
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          className="toast-close-btn"
          aria-label="Fermer"
          onClick={onClose}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Toast;
