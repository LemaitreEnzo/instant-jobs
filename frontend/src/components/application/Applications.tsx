import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import type { Application } from "../../interfaces/models.interface";
import {
  ApplicationResend,
  ApplicationResendLabel,
  ApplicationStatus,
  ApplicationStatusLabel,
  ApplicationType,
  ApplicationTypeLabel,
} from "../../types/enum.type";
import type { PropsApplicationsList } from "../../types/props.type";
import Tag from "../ui/Tag/Tag";
import ApplicationFormModal from "./ApplicationFormModal";
import "./Applications.css";

const Applications = ({
  data,
  loading: externalLoading,
  onSuccess,
  limit = data?.length,
}: PropsApplicationsList = {}) => {
  const { user } = useAuth();
  const { loading: userLoading, applications, fetchApplications } = useUser();

  const loading = externalLoading !== undefined ? externalLoading : userLoading;
  const displayApplications = data !== undefined ? data : applications;

  useEffect(() => {
    if (!data && user?.id) {
      fetchApplications(user.id);
    }
  }, [user?.id, fetchApplications, data]);

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEdit = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const formatDate = (value: Date | string) => {
    if (!value) {
      return "Date indisponible";
    }

    const date = new Date(value);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getType = (type: string) => {
    switch (type) {
      case ApplicationType.APPRENTICESHIP:
        return "tag-primary";
      case ApplicationType.INTERNSHIP:
        return "tag-terciary";
      default:
        return "tag-none";
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return "tag-success";
      case ApplicationStatus.PENDING:
        return "tag-warn";
      case ApplicationStatus.REFUSED:
        return "tag-error";
      default:
        return "tag-none";
    }
  };

  const getResend = (resend: string) => {
    switch (resend) {
      case ApplicationResend.FOLLOW_UP:
        return "tag-success";
      case ApplicationResend.INTERVIEW_COMPLETED:
        return "tag-primary";
      case ApplicationResend.NO:
        return "tag-error";
      case ApplicationResend.NOT_NECESSARY:
        return "tag-none";
      default:
        return "tag-none";
    }
  };

  return (
    <div className="applications">
      {loading ? (
        <div className="applications-loading">
          Chargement des candidatures...
        </div>
      ) : displayApplications.length > 0 ? (
        <table className="applications-table">
          <thead>
            <tr>
              <th className="applications-col">Entreprise</th>
              <th className="applications-col">Date d'envoi</th>
              <th className="applications-col">Lieu</th>
              <th className="applications-col">Titre</th>
              {/*<th className="applications-col">Description</th>*/}
              <th className="applications-col">Type</th>
              <th className="applications-col">Relance</th>
              <th className="applications-col">Statut</th>
              <th className="applications-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayApplications.slice(0, limit).map((app) => (
              <tr key={app.id} className="applications-row">
                <td className="applications-company">
                  <img src={app.logo} alt={app.company} />
                  <p>{app.company}</p>
                </td>
                <td>{formatDate(app.date)}</td>
                <td>{app.city}</td>
                <td>{app.title.slice(0, 50) + "..."}</td>
                {/*<td>{app.description}</td>*/}
                <td>
                  <Tag className={getType(app.type)}>
                    <span>{ApplicationTypeLabel[app.type]}</span>
                  </Tag>
                </td>
                <td>
                  <Tag className={getStatus(app.status)}>
                    <span>{ApplicationStatusLabel[app.status]}</span>
                  </Tag>
                </td>
                <td>
                  <Tag className={getResend(app.resend)}>
                    <span>{ApplicationResendLabel[app.resend]}</span>
                  </Tag>
                </td>
                <td>
                  <button
                    className="application-actions"
                    onClick={() => handleEdit(app)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.8 18.3C10.8 17.9022 10.9581 17.5206 11.2394 17.2393C11.5207 16.958 11.9022 16.8 12.3 16.8C12.6979 16.8 13.0794 16.958 13.3607 17.2393C13.642 17.5206 13.8 17.9022 13.8 18.3C13.8 18.6978 13.642 19.0793 13.3607 19.3607C13.0794 19.642 12.6979 19.8 12.3 19.8C11.9022 19.8 11.5207 19.642 11.2394 19.3607C10.9581 19.0793 10.8 18.6978 10.8 18.3ZM10.8 12.3C10.8 11.9022 10.9581 11.5206 11.2394 11.2393C11.5207 10.958 11.9022 10.8 12.3 10.8C12.6979 10.8 13.0794 10.958 13.3607 11.2393C13.642 11.5206 13.8 11.9022 13.8 12.3C13.8 12.6978 13.642 13.0793 13.3607 13.3606C13.0794 13.642 12.6979 13.8 12.3 13.8C11.9022 13.8 11.5207 13.642 11.2394 13.3606C10.9581 13.0793 10.8 12.6978 10.8 12.3ZM10.8 6.29999C10.8 5.90216 10.9581 5.52063 11.2394 5.23933C11.5207 4.95802 11.9022 4.79999 12.3 4.79999C12.6979 4.79999 13.0794 4.95802 13.3607 5.23933C13.642 5.52063 13.8 5.90216 13.8 6.29999C13.8 6.69781 13.642 7.07934 13.3607 7.36065C13.0794 7.64195 12.6979 7.79999 12.3 7.79999C11.9022 7.79999 11.5207 7.64195 11.2394 7.36065C10.9581 7.07934 10.8 6.69781 10.8 6.29999Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="applications-empty">Aucune candidature trouvée.</p>
      )}

      <ApplicationFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        application={selectedApplication}
        onSuccess={() => {
          if (user?.id) {
            fetchApplications(user.id);
          }
          onSuccess?.();
        }}
      />
    </div>
  );
};
export default Applications;
