import "./Label.css";

const Label = ({ ...props }) => {
  const finalClassName = ["label", props.customClassName].join(" ").trim();
  return (
    <label className={finalClassName} {...props}>
      {props.children}
    </label>
  );
};

export default Label;
