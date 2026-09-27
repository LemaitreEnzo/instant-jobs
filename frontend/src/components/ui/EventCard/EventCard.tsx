import { ApplicationType } from '../../../types/enum.type';
import type { AppointmentCalendar } from '../../../types/global.type';
import type { PropsEventCard } from '../../../types/props.type';
import './EventCard.css';

const EventCard = (props: PropsEventCard) => {
    const daysName: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const data: AppointmentCalendar[] = props.data;
    const dates: string[] = [];
    const statusTranslate = {[ApplicationType.APPRENTICESHIP]: 'Alternance', [ApplicationType.INTERNSHIP]: 'Stage'}

    /**
     * Formats date into text
     */
    for (let index = 0; index < data.length; index++) {
        const date = new Date(data[index].date);
        const dateMonth = date.getMonth();
        const dateDay = date.getDay();
        const dateNumber = date.getDate();
        dates.push(daysName[dateDay].slice(0,3) + '. ' + dateNumber + ' ' + months[dateMonth].slice(0,4));
    }

    /**
     * Remove data to old
     */
    data.filter((a) => {
        return new Date(a.date).getTime() -  Date.now() >= 0;
    })

    /**
     * Sort data by date
     */
    data.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    if (data.length == 0) {
        return(
            <div className='informations-null'>
                <p>
                    Rien de prévu
                </p>
            </div>
        )
    }

    return(
        data.slice(0,3).map((item, index) =>{
            return(
                <div className='calendar-informations-containers' key={index}>
                    <div className='informations-schedules'>
                        <p className='schedule-day'>
                            {dates[index]}
                        </p>
                        <p className='schedules-hour'>
                            {`${item.date.getHours}h${item.date.getMinutes}`} 
                        </p>
                    </div>
                    <div className='informations-content'>
                        <p className='content-title'>
                            {item.companyName}
                        </p>
                        <p className='content-description'>
                            {item.reason.slice(0,25) + '...'}
                        </p>
                    </div>
                    <div className='informations-status'>
                        <p>
                            {statusTranslate[item.type].toUpperCase()}
                        </p>
                    </div>
                </div>
            )
        })
    )
}

export default EventCard;