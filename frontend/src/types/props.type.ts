import type { SetStateAction } from "react";
import type {
  Application,
  Appointment,
  AppointmentWithApplication,
  Organization,
} from "../interfaces/models.interface";
import type { Student, User } from "../interfaces/user.interface";
import type { PropsBase } from "../types/global.type";
import type { ApplicationStatus } from "./enum.type";

export interface PropsButton extends PropsBase {
  className?: "btn-primary" | "btn-secondary" | "btn-terciary" | "btn-error";
  customClassName?: string;
  shape?: "rectangle" | "oval" | "icon";
  type?: "button" | "submit" | "reset";
  href?: string;
  navigateBack?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  onMouseDown?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
}

export interface PropsFormField extends PropsBase {
  label: string;
  name: string;
  error?: string | null;
  required?: boolean;
  customClassName?: string;
}

export interface PropsTag extends PropsBase {
  className?:
    | "tag-success"
    | "tag-warn"
    | "tag-error"
    | "tag-none"
    | "tag-primary"
    | "tag-terciary";
  customClassName?: string;
  round?: boolean;
}

export type PropsProfile = {
  className?: string;
  user: User | Student;
  organization: Organization;
};

export type PropsStatsCards = {
  className?: string;
  applications: Application[];
  appointments: Appointment[];
};

export type PropsCardStudent = {
  className?: string;
  data: Student;
};

export type PropsUserModal = {
  user: User | Student | null;
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
};

export interface PropsModal extends PropsBase {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  customClassName?: string;
}

export type PropsCardDocument = {
  name: string;
  added_at: Date;
  stockage: number;
  used: number;
  pdf_url: string;
};

export type PropsSmallCalendar = {
  data: AppointmentWithApplication[];
};

export type PropsEventCard = {
  data: AppointmentWithApplication[];
};

export type PropsApplications = {
  id: number;
  logo: string;
  company: string;
  title: string;
  description: string;
  date: string;
  city: string;
  type: string;
  status: string;
  resend: string;
  onEdit?: () => void;
};

export type PropsRecentApplications = {
  header: boolean;
  limit?: number;
};

export type PropsPersonalInformation = {
  user: User | Student;
};

export type PropsSmallProfile = {
  data: Student;
};

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error: boolean | string | null;
  customClassName?: string;
  options: SelectOption[];
}

export interface PropsFileInput {
  name: string;
  id: string;
  accept?: string;
  title?: string;
  helperText?: string;
  buttonText?: string;
  maxSizeMB: number;
  customClassName?: string;
  error: string | null;
  onFileSelect: (file: File | null) => void;
  onError?: (errorMessage: string | null) => void;
}

export type PropsApplicationFormModal = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  application?: Application | null;
  onSuccess?: () => void;
};

export interface ApplicationFilters {
  statuses: ApplicationStatus[];
  types: string[];
  resends: string[];
}

export type PropsApplicationHeader = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  filters: ApplicationFilters;
  onFilterChange: (filters: ApplicationFilters) => void;
};

export type PropsPageTilte = {
  title: string;
};

export interface PropsCheckbox {
  id?: string;
  name?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  customClassName?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  checked?: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface SortOption {
  label: string;
  value: string;
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

export interface PropsApplicationsList {
  data?: Application[];
  loading?: boolean;
  limit?: number;
  onSuccess?: () => void;
}

export interface PropsFilterBar {
  filterGroups?: FilterGroup[];
  onFilterChange?: (activeFilters: Record<string, string[]>) => void;
  sortOptions?: SortOption[];
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;
  onAdd?: () => void;
  onAddClick?: () => void;
  customClassName?: string;
}

export type PropsSchoolCard = {
  name: string;
  logo: string;
  description: string;
};

export type PropsSoon = {
  data: Appointment[];
};
