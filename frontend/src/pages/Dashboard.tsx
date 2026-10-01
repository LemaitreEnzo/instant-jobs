import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import CampusApplicationsChart from "../components/ui/CampusApplicationsChart/CampusApplicationsChart";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { MonthApplicationStat } from "../interfaces/models.interface";
import "../assets/css/pages/dashboard.css";
import ApplicationAddButton from "../components/common/ApplicationAddButton/ApplicationAddButton";

function Dashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<MonthApplicationStat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ce composant est strictement réservé au Staff ou à l'Admin
  const isStaffOrAdmin = role === "staff" || role === "admin";

  useEffect(() => {
    // Si l'utilisateur n'est pas autorisé ou n'a pas d'organisation, on ne charge rien
    if (!isStaffOrAdmin || !user?.organizationId) return;

    const loadStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.organization.fetchApplicationStatistics(
          Number(user.organizationId),
          {
            year: new Date().getFullYear(),
            // Filtre optionnel sur le campus de l'utilisateur si disponible
            campusId: user.campusId ? Number(user.campusId) : undefined,
          }
        );
        setStats(response.months);
      } catch (err: unknown) {
        console.error("Erreur lors de la récupération des statistiques :", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [isStaffOrAdmin, user?.organizationId, user?.campusId]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="dashboard">
          <p>Chargement de la session...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard">
        {isStaffOrAdmin ? (
          <div style={{ width: "100%", padding: "20px" }}>
            {loading && <p>Chargement des statistiques...</p>}
            {error && <p style={{ color: "var(--error-color)" }}>{error}</p>}
            {!loading && !error && (
              <CampusApplicationsChart
                data={stats}
                title="Candidatures envoyées sur le campus"
              />
            )}
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            {/* Contenu spécifique aux étudiants si nécessaire */}
            <p>Espace étudiant</p>
            <ApplicationAddButton />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;
