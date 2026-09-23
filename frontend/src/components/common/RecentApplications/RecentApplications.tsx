import { useEffect, useState } from "react";
import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsRow from "./ApplicationsRow";

import type { Application } from "../../../interfaces/models.interface";
import type { PropsRecentApplications } from "../../../types/props.type";

import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../hooks/useUser";

import "./RecentApplications.css";

const RecentApplications = ({ ...props }: PropsRecentApplications) => {

  const columns = ['Nom d\'entreprise', 'Date d\'envoie', 'Lieu', 'Titre', 'Description', 'Type', 'Status', 'Relance', ''];
  const [applications, setApplications] = useState<Application[]>([]);
  const { user } = useAuth();
  const { loading, fetchApplications } = useUser();

  const getApplications = async () => {
    if (!user?.id) {
      return
    }

    try {
      const applicationData = await fetchApplications(user?.id as number, props.limit as number);
      setApplications(applicationData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getApplications();
  }, [user?.id, props.limit]);

  return (
    <div className="recent-applications">
      {props.header ? <ApplicationsHeader /> : null}

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
              <ApplicationsRow key={app.title} {...app} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="recent-applications-empty">Aucune candidature pour le moment.</p>
      )}
    </div>
  );
}
export default RecentApplications