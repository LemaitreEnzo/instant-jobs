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
  const finalClassName = [`btn-${shape}`, className].join(" ").trim();

  if (props.href) {
    return (
      <a {...props} href={props.href} className={finalClassName}>
        {props.children}
      </a>
    );
  }

  return (
    <button {...props} type={type} className={finalClassName}>
      {props.children}
    </button>
  );
};

export default Button;
