export type Role = "user" | "admin" | "staff";
export interface PropsBase {
  children: React.ReactNode;
}

export type BtnSideBar = {
  label: string,
  link: string,
  icon: React.ReactNode,
  isActive: boolean
}
