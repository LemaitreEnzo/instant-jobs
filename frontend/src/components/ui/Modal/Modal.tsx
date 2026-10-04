import { useEffect } from "react";
import type { PropsModal } from "../../../types/props.type";
import "./Modal.css";

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  showCloseButton = true,
  customClassName = "",
  children
}: PropsModal) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const hasHeader = title || description || showCloseButton;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`modal-container modal-${size} ${customClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {hasHeader && (
          <div className="modal-header">
            <div className="modal-header-content">
              {title && <h3 className="modal-title">{title}</h3>}
              {description && (
                <p className="modal-description">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="modal-close-button"
                aria-label="Fermer"
                onClick={() => onOpenChange(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
