import "../assets/css/pages/dashboard.css";
import Applications from "../components/application/Applications";
import SmallCalendar from "../components/ui/SmallCalendar/SmallCalendar";
import StatsCards from "../components/ui/StatsCards/StatsCards";
import { useAuth } from "../context/AuthContext";
import type { Student } from "../interfaces/user.interface";
import { UserRole } from "../types/enum.type";

function Dashboard() {
  const { user, loading } = useAuth();

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
    const studentUser = user as Student;
    const rawAppointments = studentUser.appointments || [];
    const applications = studentUser.applications || [];

    const duplicatedApplications = [...applications];

    if (applications.length > 0) {
      const baseApp = applications[0];
      for (let index = 1; index < 30; index++) {
        duplicatedApplications.push({
          ...baseApp,
          id: baseApp.id + index,
          title: `${baseApp.title} (Copie ${index})`,
        });
      }
    }

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
              <SmallCalendar data={appointments} />
            </div>
            <Applications data={duplicatedApplications} limit={5} />
          </>
        )}
      </div>
    );
  }

  return null;
}

export default Dashboard;
