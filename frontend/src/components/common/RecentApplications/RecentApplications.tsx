import { useEffect, useState } from "react";
import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsRow from "./ApplicationsRow";

import type { Application } from "../../../interfaces/models.interface";
import type { ApplicationFilters, PropsRecentApplications } from "../../../types/props.type";

import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../hooks/useUser";

import "./RecentApplications.css";
import ApplicationFormModal from "../ApplicationFormModal/ApplicationFormModal";

const RecentApplications = ({ ...props }: PropsRecentApplications) => {

  const columns = ['Nom d\'entreprise', 'Date d\'envoie', 'Lieu', 'Titre', 'Description', 'Type', 'Status', 'Relance', ''];
  const [applications, setApplications] = useState<Application[]>([]);
  const { user } = useAuth();
  const { loading, fetchApplications } = useUser();

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<ApplicationFilters>({
    statuses: [],
    types: [],
    resends: [],
  });

  const getApplications = async () => {
    if (!user?.id) {
      return
    }

    try {
      const applicationData = await fetchApplications(user?.id as number, props.limit as number, filters);
      setApplications(applicationData);
    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  }

  useEffect(() => {
    getApplications();
  }, [user?.id, props.limit, filters, fetchApplications]);

  const handleEdit = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  return (
    <div className="recent-applications">
      {props.header ? <ApplicationsHeader open={isFilterOpen} onOpenChange={setIsFilterOpen} filters={filters} onFilterChange={setFilters} /> : null}

      {loading ? (
        <div className="recent-applications-loading">Chargement des candidatures...</div>
      ) : applications.length > 0 ? (
        <table className="recent-applications-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="recent-applications-col">{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <ApplicationsRow key={app.title} {...app} onEdit={() => handleEdit(app)} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="recent-applications-empty">Aucune candidature trouvée.</p>
      )}

      <ApplicationFormModal open={isModalOpen} onOpenChange={setIsModalOpen} application={selectedApplication} onSuccess={getApplications} />
    </div>
  );
}
export default RecentApplications