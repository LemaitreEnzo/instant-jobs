export enum ApplicationType {
  INTERNSHIP = "internship",
  APPRENTICESHIP = "apprenticeship",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REFUSED = "refused",
  ACCEPTED = "accepted",
}

export enum ApplicationResend {
  FOLLOW_UP = "follow up",
  INTERVIEW_COMPLETED = "interview completed",
  NO = "no follow up",
  NOT_NECESSARY = "not necessary",
}

export enum AppointmentStatus {
  INCOMING = "incoming",
  CANCELED = "canceled",
  FINISHED = "finished",
}

export const AppointmentStatusLabel = {
  [AppointmentStatus.INCOMING]: "À venir",
  [AppointmentStatus.CANCELED]: "Annulé",
  [AppointmentStatus.FINISHED]: "Passé",
};

export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
  STAFF = "staff",
}

export enum StudentStatus {
  SEARCH = "search",
  PENDING = "pending",
  FOUND = "found",
}

export enum CalendarView {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export enum OrganizationRole {
  COMPANY = "company",
  SCHOOL = "school",
}
