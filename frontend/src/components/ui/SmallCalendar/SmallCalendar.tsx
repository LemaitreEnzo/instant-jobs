import { DAYS, MONTHS } from "../../../constants/global.constant";
import type { DayInformations } from "../../../types/global.type";
import type { PropsSmallCalendar } from "../../../types/props.type";
import Button from "../Button/Button";
import EventCard from "../EventCard/EventCard";
import "./SmallCalendar.css";

const SmallCalendar = (props: PropsSmallCalendar) => {
  const appointmentsData = props.data;

  const todayDate: Date = new Date();
  const week: DayInformations[] = [];
  const todayDateDay: number = todayDate.getDay();

  /**Get the informations of the week */
  for (let index = 1; index < 8; index++) {
    const currentDay: number = todayDateDay === 0 ? 7 : todayDateDay;

    if (index < currentDay) {
      const diff: number = currentDay - index;
      const day: Date = new Date(
        todayDate.getTime() - 1000 * 60 * 60 * 24 * diff,
      );
      const information: DayInformations = {
        date: day.getDate(),
        day: day.getDay(),
      };
      week.push(information);
      continue;
    }
    if (index > currentDay) {
      const diff: number = index - currentDay;
      const day: Date = new Date(
        todayDate.getTime() + 1000 * 60 * 60 * 24 * diff,
      );
      const information: DayInformations = {
        date: day.getDate(),
        day: day.getDay(),
      };
      week.push(information);
      continue;
    }
    if (index == currentDay) {
      const information = {
        date: todayDate.getDate(),
        day: todayDate.getDay(),
      };
      week.push(information);
    }
  }

  return (
    <div className="small-calendar">
      <div className="calendar-date">
        <div className="calendar-month-year">
          <p>{`${MONTHS[todayDate.getMonth()]} ${todayDate.getFullYear()}`}</p>
        </div>
        <div className="calendar-days">
          {week.map((day, index) => {
            return (
              <div className="calendar-days-content" key={index}>
                <p className="calendar-days-day">
                  {`${DAYS[day.day].slice(0, 3)}.`}
                </p>
                <p
                  className={`calendar-days-date ${day.day === todayDateDay ? "date-today" : ""}`}
                >
                  {`${day.date}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="calendar-informations">
        <EventCard data={appointmentsData} />
      </div>
      <div className="small-calendar-btn">
        <Button
          href={`/${props.organization?.slug}/calendar`}
          className="btn-primary"
          shape="rectangle"
        >
          <span>Voir le calendrier</span>
        </Button>
      </div>
    </div>
  );
};

export default SmallCalendar;
