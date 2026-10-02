import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import ApplicationsChart from "../components/ui/ApplicationsChart/ApplicationsChart";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import ApplicationAddButton from "../components/common/ApplicationAddButton/ApplicationAddButton";
import type { User } from "../interfaces/user.interface";
import type { MonthApplicationStat } from "../interfaces/models.interface";

import "../assets/css/pages/dashboard.css";


function Dashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<MonthApplicationStat[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isStaffOrAdmin = role === "staff" || role === "admin";

  useEffect(() => {
    if (!isStaffOrAdmin || !user?.organizationId) return;
    const loadStudents = async () => {
      try {
        const users = await api.organization.fetchUsers(Number(user.organizationId));
        const studentList = users.filter((u) => u.role === "student");
        setStudents(studentList);
      } catch (err) {
        console.error("Erreur lors du chargement des étudiants :", err);
      }
    };
    loadStudents();
  }, [isStaffOrAdmin, user?.organizationId]);

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
            studentId: selectedStudentId ?? undefined,
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
  }, [isStaffOrAdmin, user?.organizationId, selectedStudentId]);

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
                students={students}
                selectedStudentId={selectedStudentId}
                onStudentChange={setSelectedStudentId}
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