import { useMemo, useState } from "react";
import "../../assets/css/pages/student/applications.css";
import ApplicationFormModal from "../../components/application/ApplicationFormModal";
import Applications from "../../components/application/Applications";
import FilterBar from "../../components/layout/FilterBar/FilterBar";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import { useAuth } from "../../context/AuthContext";
import type { Student } from "../../interfaces/user.interface";
import {
  ApplicationResend,
  ApplicationResendLabel,
  ApplicationStatus,
  ApplicationStatusLabel,
  ApplicationType,
  ApplicationTypeLabel,
  UserRole,
} from "../../types/enum.type";
import type {
  FilterGroup,
  SortOption,
  SortState,
} from "../../types/props.type";

function ApplicationsPage() {
  const { user, loading } = useAuth();
  const applications = (user as Student).applications;

  const sortOptions: SortOption[] = useMemo(
    () => [{ label: "Date d'envoi", value: "date" }],
    [],
  );

  const defaultSort: SortState = useMemo(
    () => ({ field: "date", direction: "desc" }),
    [],
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [activeSort, setActiveSort] = useState<SortState>(defaultSort);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const filteredAndSortedApplications = useMemo(() => {
    if (!applications) return [];
    let result = [...applications];
    // Filtre par statut
    const selectedStatuses = activeFilters["status"] || [];
    if (selectedStatuses.length > 0) {
      result = result.filter((app) => selectedStatuses.includes(app.status));
    }
    // Filtre par type
    const selectedTypes = activeFilters["type"] || [];
    if (selectedTypes.length > 0) {
      result = result.filter((app) => selectedTypes.includes(app.type));
    }
    // Filtre par relance
    const selectedResends = activeFilters["resend"] || [];
    if (selectedResends.length > 0) {
      result = result.filter((app) => selectedResends.includes(app.resend));
    }
    // Tri par date
    if (activeSort.field === "date") {
      result.sort((a, b) => {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return activeSort.direction === "asc" ? timeA - timeB : timeB - timeA;
      });
    }
    return result;
  }, [applications, activeFilters, activeSort]);

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        id: "status",
        title: "Statut",
        options: [
          {
            id: ApplicationStatus.PENDING,
            label: ApplicationStatusLabel[ApplicationStatus.PENDING],
          },
          {
            id: ApplicationStatus.ACCEPTED,
            label: ApplicationStatusLabel[ApplicationStatus.ACCEPTED],
          },
          {
            id: ApplicationStatus.REFUSED,
            label: ApplicationStatusLabel[ApplicationStatus.REFUSED],
          },
        ],
      },
      {
        id: "type",
        title: "Type de contrat",
        options: [
          {
            id: ApplicationType.APPRENTICESHIP,
            label: ApplicationTypeLabel[ApplicationType.APPRENTICESHIP],
          },
          {
            id: ApplicationType.INTERNSHIP,
            label: ApplicationTypeLabel[ApplicationType.INTERNSHIP],
          },
        ],
      },
      {
        id: "resend",
        title: "Statut de relance",
        options: [
          {
            id: ApplicationResend.FOLLOW_UP,
            label: ApplicationResendLabel[ApplicationResend.FOLLOW_UP],
          },
          {
            id: ApplicationResend.INTERVIEW_COMPLETED,
            label:
              ApplicationResendLabel[ApplicationResend.INTERVIEW_COMPLETED],
          },
          {
            id: ApplicationResend.NO,
            label: ApplicationResendLabel[ApplicationResend.NO],
          },
          {
            id: ApplicationResend.NOT_NECESSARY,
            label: ApplicationResendLabel[ApplicationResend.NOT_NECESSARY],
          },
        ],
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Chargement en cours...
      </div>
    );
  }

  if (user) {
    return (
      <div className="application-page">
        {user.role === UserRole.STUDENT && (
          <>
            <div className="top">
              <PageTitle title="Mes candidatures" />
              <FilterBar
                filterGroups={filterGroups}
                onFilterChange={setActiveFilters}
                sortOptions={sortOptions}
                defaultSort={defaultSort}
                onSortChange={setActiveSort}
                onAddClick={() => setIsCreateModalOpen(true)}
              />
            </div>
            <Applications data={filteredAndSortedApplications} />

            <ApplicationFormModal
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            />
          </>
        )}
      </div>
    );
  }

  return null;
}

export default ApplicationsPage;
