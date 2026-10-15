import { DAYS, NOW } from "../../../constants/global.constant";
import type { PropsSoon } from "../../../types/props.type";
import "./Soon.css";

function Soon(props: PropsSoon) {
  const appointments = props.data;

  appointments.filter((a) => {
    return new Date(a.date).getTime() - NOW >= 0;
  });

  appointments.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const noAppointments = () => {
    return <span className="soon-content-nothing">Rien de prévu !</span>;
  };

  return (
    <div className="soon-container">
      <span className="soon-container-title">Prochainement (à faire)</span>
      <div className="soon-content">
        {appointments.length == 0
          ? noAppointments()
          : appointments.slice(0, 4).map((appointment, index) => {
              const date = new Date(appointment.date);
              const dateDay = date.getDay();
              const dateNumber = date.getDate();

              return (
                <div className="soon-content-appointment" key={index}>
                  <p className="soon-appointment-summary">
                    <span>{`${dateNumber} ${DAYS[dateDay].slice(0, 3)} `}</span>{" "}
                    : {appointment.reason}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Soon;
