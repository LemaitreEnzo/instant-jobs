import "./Input.css";

const Input = ({ type, error, ...props }) => {
  const finalClassName = ["input", props.customClassName].join(" ").trim();
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
