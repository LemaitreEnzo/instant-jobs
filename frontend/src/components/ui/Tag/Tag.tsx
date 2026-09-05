import type { PropsTag } from "../../../types/props.type";
import "./Tag.css";
const Tag = ({ round = false, ...props }: PropsTag) => {
  const classes: string = `tag ${props.className}`;
  return (
    <div {...props} className={classes}>
      {round ? <div className="round"></div> : null}
      {props.children}
    </div>
  );
};
export default Tag;
