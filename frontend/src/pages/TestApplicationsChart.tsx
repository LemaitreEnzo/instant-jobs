import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import ApplicationsChart from "../components/ui/ApplicationsChart/ApplicationsChart";
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

  const isStaffOrAdmin = role === "staff" || role === "admin";

  useEffect(() => {
    if (!isStaffOrAdmin || !user?.organizationId) return;

    const loadStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.organization.fetchApplicationStatistics(
          Number(user.organizationId),
          {
            year: new Date().getFullYear(),
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
  }, [isStaffOrAdmin, user?.organizationId]);

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
              <ApplicationsChart
                data={stats}
                title="Candidatures envoyées dans l'organisation"
              />
            )}
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            <p>Espace étudiant</p>
            <ApplicationAddButton />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;