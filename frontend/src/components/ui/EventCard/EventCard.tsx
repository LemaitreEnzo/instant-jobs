import type { Application } from '../../../interfaces/models.interface';
import type { PropsEventCard } from '../../../types/props.type';
import './EventCard.css';

const EventCard = (props: PropsEventCard) => {
    const daysName: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const data: Application[] = props.data;
    const dates: string[] = [];

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
     * Sort data by date
     */
    data.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    return(
        data.slice(0,3).map((item, index) =>{
            return(
                <div className='calendar-informations-containers' key={index}>
                    <div className='informations-schedules'>
                        <p className='schedule-day'>
                            {dates[index]}
                        </p>
                        <p className='schedules-hour'>
                            {/*item.hour*/} 
                        </p>
                    </div>
                    <div className='informations-content'>
                        <p className='content-title'>
                            {item.company}
                        </p>
                        <p className='content-description'>
                            {item.description.slice(0,25) + '...'}
                        </p>
                    </div>
                    <div className='informations-status'>
                        <p>
                            {item.status.toLocaleUpperCase()}
                        </p>
                    </div>
                </div>
            )
        })
    )
}

export default EventCard;