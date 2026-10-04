export enum ApplicationType {
  INTERNSHIP = "internship",
  APPRENTICESHIP = "apprenticeship",
}

export const ApplicationTypeLabel = {
  [ApplicationType.INTERNSHIP]: "Stage",
  [ApplicationType.APPRENTICESHIP]: "Alternance",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REFUSED = "refused",
  ACCEPTED = "accepted",
}

export const ApplicationStatusLabel = {
  [ApplicationStatus.PENDING]: "En attente",
  [ApplicationStatus.REFUSED]: "Refusée",
  [ApplicationStatus.ACCEPTED]: "Acceptée",
}

export enum ApplicationResend {
  FOLLOW_UP = "follow up",
  INTERVIEW_COMPLETED = "interview completed",
  NO = "no follow up",
  NOT_NECESSARY = "not necessary",
}

export const ApplicationResendLabel = {
  [ApplicationResend.FOLLOW_UP]: "À relancer",
  [ApplicationResend.INTERVIEW_COMPLETED]: "Entretien passé",
  [ApplicationResend.NO]: "Pas de relance",
  [ApplicationResend.NOT_NECESSARY]: "Non nécessaire",
}

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

export enum OrganizationRole {
  COMPANY = "company",
  SCHOOL = "school",
}
