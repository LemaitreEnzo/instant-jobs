import type { Student } from "../interfaces/user.interface";
import type { PropsBase } from "../types/global.type";
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
  data: Student;
};

export type PropsStatsCards = {
  className?: string;
  data: Student["application"];
};

export type PropsCardStudent = {
  className?: string;
  data: Student;
};
