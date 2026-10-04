import { useNavigate } from "react-router-dom";
import type { PropsButton } from "../../../types/props.type";
import "./Button.css";

/**
 * A generic and reusable Button component.
 *
 * @component
 * @example
 * <Button onClick={() => alert('Clicked!')} className="btn-primary" shape="oval">
 *   Submit
 * </Button>
 *
 * @returns The rendered HTML button element.
 */
const Button = ({
  type = "button",
  shape = "oval",
  className = "btn-primary",
  ...props
}: PropsButton) => {
  const finalClassName = [`btn-${shape}`, className, props.customClassName].join(" ").trim();
  const navigate = useNavigate();
  const { navigateBack, ...buttonProps } = props;

  const handleBack = () => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/");
  }
};

  if (navigateBack) {
    return (
      <button {...buttonProps} className={finalClassName} onClick={handleBack}>
        {buttonProps.children} 
      </button>
    );
  }

  if (buttonProps.href) {
    return (
      <a {...props} href={props.href} className={finalClassName}>
        {buttonProps.children} 
      </a>
    );
  }

  return (
    <button {...buttonProps} type={type} className={finalClassName}>
      {buttonProps.children}
    </button>
  );
};

export default Button;
