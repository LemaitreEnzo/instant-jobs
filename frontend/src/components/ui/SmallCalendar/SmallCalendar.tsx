import type {DayInformations} from '../../../types/global.type';
import type { PropsSmallCalendar } from '../../../types/props.type';
import EventCard from '../EventCard/EventCard';
import './SmallCalendar.css';

const SmallCalendar = (props: PropsSmallCalendar) => {
    
    const todayDate: Date = new Date();
    const daysName: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const week: Array<DayInformations> = []
    const todayDateDay: number = todayDate.getDay();

    for (let index = 1; index < 8; index++) {
        if (index < todayDateDay) {
            const diff: number = todayDateDay - index;
            const day: Date = new Date(todayDate.getTime() - (1000 * 60 * 60 * 24 * diff) );
            const information: DayInformations = {date: day.getDate(), day: day.getDay()};
            week.push(information);
            continue;
        }
        if (index > todayDateDay) {
            const diff: number = index - todayDateDay;
            const day: Date = new Date(todayDate.getTime() + (1000 * 60 * 60 * 24 * diff) );
            const information: DayInformations = {date: day.getDate(), day: day.getDay()};
            week.push(information);
            continue;
        }
        if (index == todayDateDay) {
            const information = {date: todayDate.getDate(), day: todayDate.getDay()};
            week.push(information);
        }
    }
    
    return(
        <div className="small-calendar">
            <div className="calendar-date">
                <div className="calendar-month-year">
                    <p>
                        {`${months[todayDate.getMonth()]} ${todayDate.getFullYear()}`}
                    </p>
                </div>
                <div className="calendar-days">
                    {week.map((day, index) =>  {
                        return(
                            <div className='calendar-days-content' key={index}>
                                <p className='calendar-days-day'>
                                    {`${daysName[day.day].slice(0,3)}.`}
                                </p>
                                <p className={`calendar-days-date ${day.day === todayDateDay ? 'date-today': ''}`}>
                                    {`${day.date}`}
                                </p>    
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='calendar-informations'>
                <EventCard data={props.data} />
            </div>
            <div className='small-calendar-btn'>
                <a href='#'>
                    Voir le calendrier
                </a>
            </div>
        </div>
    )
}

export default SmallCalendar