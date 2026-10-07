import { useEffect, useState } from "react";
import "../assets/css/pages/calendar.css";
import PageTitle from "../components/layout/PageTitle/PageTitle";
import BigCalendar from "../components/ui/BigCalendar/BigCalendar";
import Soon from "../components/ui/Soon/Soon";
import { useAuth } from "../context/AuthContext";
import useApplication from "../hooks/useApplication";
import useUser from "../hooks/useUser";
import type { Appointment } from "../interfaces/models.interface";

function Calendar() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const { user } = useAuth();
  const { fetchApplications } = useUser();
  const { fetchAppointments } = useApplication();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const userId = user.id;
          const applications = await fetchApplications(userId);

          const appointmentsPromises = applications.map((application) =>
            fetchAppointments(application.id),
          );

          const appointmentsNested = await Promise.all(appointmentsPromises);
          const appointmentsList = appointmentsNested.flat();

          setAppointments(appointmentsList);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    loadData();
  }, []);

  if (appointments) {
    return (
      <div className="page-calendar">
        <div className="page-calendar-header">
          <PageTitle title="Calendrier" />
        </div>
        <div className="page-calendar-container">
          <BigCalendar />
          <div className="page-calendar-appointments">
            <Soon data={appointments} />
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="page-calendar">test</div>;
  }
}

export default Calendar;
