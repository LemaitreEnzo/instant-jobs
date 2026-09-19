import type { PropsTag } from "../../../types/props.type";
import "./Tag.css";
const Tag = ({ round = false, ...props }: PropsTag) => {
  const finalClassName = ["tag", props.className, props.customClassName]
    .join(" ")
    .trim();
  return (
    <div {...props} className={finalClassName}>
      {round ? <div className="round"></div> : null}
      {props.children}
    </div>
  );
};
export default Tag;
