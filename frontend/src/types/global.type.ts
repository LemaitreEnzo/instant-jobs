import type React from "react";

export type Role = "student" | "admin" | "staff";
export interface PropsBase {
  children: React.ReactNode;
}

export type BtnSideBar = {
  label: string;
  link: string;
  icon: React.ReactNode;
  isActive: boolean;
};

export type DayInformations = {
  date: number;
  day: number;
  // label: string;
  // link: string;
  // icon: React.ReactNode;
  // isActive: boolean;
};

export type Route = {
  path: string;
  element: React.ReactNode;
};
