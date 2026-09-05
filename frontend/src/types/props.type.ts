import type { PropsBase } from "../types/global.type";
import type { User } from "./models.type";

export interface PropsButton extends PropsBase {
  className?: "btn-primary" | "btn-secondary";
  shape?: "rectangle" | "oval";
  type?: "button" | "submit" | "reset";
  href?: string;
}

export interface PropsTag extends PropsBase {
  className?:
    | "tag-success"
    | "tag-warn"
    | "tag-error"
    | "tag-none"
    | "tag-terciary";
  round?: boolean;
}

export type PropsProfile = {
  className?: string;
  data: User;
};
