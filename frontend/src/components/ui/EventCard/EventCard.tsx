import { DAYS, MONTHS, NOW } from "../../../constants/global.constant";
import type { PropsEventCard } from "../../../types/props.type";
import "./EventCard.css";

const EventCard = (props: PropsEventCard) => {
  const data = props.data || [];
  const dates: string[] = [];

  /**
   * Formats date into text
   */
  for (let index = 0; index < data.length; index++) {
    const date = new Date(data[index].date);
    const dateMonth = date.getMonth();
    const dateDay = date.getDay();
    const dateNumber = date.getDate();
    dates.push(
      DAYS[dateDay].slice(0, 3) +
        ". " +
        dateNumber +
        " " +
        MONTHS[dateMonth].slice(0, 4),
    );
  }

  /**
   * Remove data to old
   */
  data.filter((a) => {
    return new Date(a.date).getTime() - NOW >= 0;
  });

  /**
   * Sort data by date
   */
  data.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  if (data.length == 0) {
    return (
      <div className="informations-null">
        <p>Rien de prévu</p>
      </div>
    );
  }

  return data.slice(0, 3).map((item, index) => {
    const date = new Date(item.date);

    return (
      <div className="calendar-informations-containers" key={index}>
        <div className="informations-schedules">
          <p className="schedule-day">{dates[index]}</p>
          <p className="schedules-hour">
            {`${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        <div className="informations-content">
          <p className="content-title">{item.application?.company}</p>
          <p className="content-description">{item.reason}</p>
        </div>
        <div className="informations-status">
          <p>{item.status.toUpperCase()}</p>
        </div>
      </div>
    );
  });
};

export default EventCard;
