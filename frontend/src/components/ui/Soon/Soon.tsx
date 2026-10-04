import type { PropsSoon } from '../../../types/props.type';
import './Soon.css';

function Soon(props: PropsSoon) {
    const daysName: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const appointments = props.data;

    appointments.filter((a) => {
        return new Date(a.date).getTime() -  Date.now() >= 0;
    })

    appointments.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    const noAppointments = () => {
        return(
            <span className='soon-content-nothing'>
                Rien de prévu !
            </span>
        )
    }

  return (
    <div className='soon-container'>
        <span className='soon-container-title'>
            Prochainement (à faire)
        </span>
        <div className='soon-content'>
            {appointments.length == 0 ? noAppointments() : appointments.slice(0,4).map((appointment, index) => {
                const dateDay = appointment.date.getDay();
                const dateNumber = appointment.date.getDate();

                return(
                    <div className='soon-content-appointment' key={index}>
                        <p className='soon-appointment-summary'>
                            <span>{`${dateNumber} ${daysName[dateDay].slice(0,3)} `}</span> : { `${appointment.reason.slice(0,15)}...`}
                        </p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Soon