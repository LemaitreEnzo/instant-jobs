import "../assets/css/pages/dashboard.css";
import Applications from "../components/application/Applications";
import SmallCalendar from "../components/ui/SmallCalendar/SmallCalendar";
import StatsCards from "../components/ui/StatsCards/StatsCards";
import { useAuth } from "../context/AuthContext";
import type { Student } from "../interfaces/user.interface";
import { UserRole } from "../types/enum.type";

/**
 * Dashboard page component.
 * Displays role-specific operational metrics, upcoming interview events via SmallCalendar,
 * and recent applications table for students.
 */
function Dashboard() {
  const { user, loading, organization } = useAuth();

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

  if (user && organization) {
    const studentUser = user as Student;
    const rawAppointments = studentUser.appointments || [];
    const applications = studentUser.applications || [];

    const appointments = rawAppointments.map((appointment) => {
      const matchingApplication = applications.find(
        (app) => app.id === appointment.applicationId,
      );

      return {
        ...appointment,
        application: matchingApplication,
      };
    });

    return (
      <div className="dashboard">
        {user.role === UserRole.STUDENT && (
          <>
            <div className="top">
              <StatsCards
                applications={applications}
                appointments={appointments}
              />
              <SmallCalendar data={appointments} organization={organization} />
            </div>
            <Applications data={applications} limit={5} />
          </>
        )}
      </div>
    );
  }

  return null;
}

export default Dashboard;
