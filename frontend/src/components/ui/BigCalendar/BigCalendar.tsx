import { useState } from 'react';
import './BigCalendar.css';
import { CalendarView } from '../../../types/enum.type';

function BigCalendar() {
    const daysName: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const [calendarView, setCalendarView] = useState<CalendarView>(CalendarView.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());

    function generateCalendarMonthView() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstOfMonth.getDay();
        const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startDate = new Date(year, month, 1 - dayOffset);
        const totalDays = [];
        const totalweeks = [];
        var week = [];
        const cursor = new Date(startDate);
        const now = new Date();

        for (let i = 0; i < 42; i++) {
            totalDays.push({
                date: new Date(cursor),
                dayNumber: cursor.getDate(),
                isToday: cursor.getMonth() === now.getMonth() && cursor.getDay() === now.getDay() && cursor.getFullYear() === now.getFullYear() && cursor.getDate() === now.getDate() ,
            });

            cursor.setDate(cursor.getDate() + 1);
        }

        for (let index = 0; index < totalDays.length; index++) {
            if ((index + 1) % 7 == 0) {
                week.push(totalDays[index]);
                totalweeks.push(week);
                week = [];
            }else{
                week.push(totalDays[index]);
            }
        }

        return(
            <div className='calendar-month'>
                <ul className='calendar-month-weekdays'>
                    {daysName.map((day, index) => {
                        return(
                            <li key={index} className='calendar-month-weekday'>
                                {day}
                            </li>
                        )
                    })}
                </ul>
                <div className='calendar-month-view'>
                    {totalweeks.map((week, index) => {
                        return(
                            <ul className='calendar-month-week' key={index}>
                                {week.map((day, index) => {
                                    return(
                                        <li className='calendar-month-day' key={index}>
                                            <span id={day.isToday ? 'today' : ''}>
                                                {day.dayNumber}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    })}
                </div>
            </div>
        )
    }

    function generateCalendarWeekView() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();
        const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startDate = new Date(year, month, day - dayOffset);
        const cursor = new Date(startDate);
        const week = [];
        const hours: string[] = []

        for (let index = 0; index < 24; index++) {
            if (index < 10) {
                hours.push(`0${index.toString()}`)
            }else{
                hours.push(index.toString());
            }
        }

        for (let index = 0; index < 7; index++) {
            week.push({
                date: new Date(cursor),
                day: daysName[index],
                dayNumber: cursor.getDate(),
                hours: hours
            })

            cursor.setDate(cursor.getDate() + 1);
        }

        return(
            <div className='calendar-week'>
                <div className='calendar-week-header'>
                    <div className='calendar-week-empty'></div>
                    <ul className='calendar-week-weekdays'>
                        {week.map((day, index) => {
                            return(
                                <li className='calendar-week-weekday' key={index}>
                                    {`${daysName[index].slice(0,3)}. ${day.dayNumber}`}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='calendar-week-container'>
                    <div className='calendar-week-hours'>
                        {hours.map((hour, index) => {
                            return(
                                <div className='calendar-week-hour' key={index}>
                                    <span>
                                        {hour} : 00
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <ul className='calendar-week-days'>
                        {week.map((day, index) => {
                            return(
                                <div key={index} className='calendar-week-day'>
                                    {hours.map((hour, index) => {
                                        return(
                                            <div key={index} className='calendar-week-slot'>
                                                
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    function generateCalendarDayView(){
        const cursor = new Date(currentDate);
        const dayWeek = cursor.getDay();
        const dayOffset = dayWeek === 0 ? 6 : dayWeek - 1;
        const hours: string[] = []

        for (let index = 0; index < 24; index++) {
            if (index < 10) {
                hours.push(`0${index.toString()}`)
            }else{
                hours.push(index.toString());
            }
        }

        return(
            <div className='calendar-day'>
                <div className='calendar-day-summary'>
                    <span>
                        {`${daysName[dayOffset]} ${cursor.getDate()} ${months[cursor.getMonth()]}`}
                    </span>
                </div>
                <ul className='calendar-day-hours'>
                    {hours.map((hour, index) => {
                        return(
                            <li className='calendar-day-content' key={index}>
                                <div className='calendar-day-hour'>
                                    {hour}
                                </div>
                                <div className='calendar-day-slot'>
                                        
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    function resetDate(){
        setCurrentDate(new Date);
    }

    function handleNextWeek() {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 7);
        setCurrentDate(next);
    }

    function handlePrevWeek() {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 7);
        setCurrentDate(prev);
    }

    function handleNextMonth() {
        const next = new Date(currentDate);
        next.setDate(1);
        next.setMonth(next.getMonth() + 1);
        setCurrentDate(next);
    }

    function handlePrevMonth() {
        const prev = new Date(currentDate);
        prev.setDate(1);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentDate(prev);
    }

    function handleNextDay(){
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    }

    function handlePrevDay(){
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    }

    function handleNext(){
        if (calendarView === CalendarView.MONTH) {
            handleNextMonth();
        }
        else if (calendarView === CalendarView.WEEK){
            handleNextWeek()
        }
        else{
            handleNextDay();
        }
    }

    function handlePrev(){
        if (calendarView === CalendarView.MONTH) {
            handlePrevMonth();
        }
        else if (calendarView === CalendarView.WEEK){
            handlePrevWeek()
        }
        else{
            handlePrevDay();
        }
    }

    function generateCalendarView() {
        if (calendarView == CalendarView.MONTH) {
            return generateCalendarMonthView();
        }

        if (calendarView == CalendarView.DAY) {
            return generateCalendarDayView();
        }

        if (calendarView == CalendarView.WEEK) {
            return generateCalendarWeekView();
        }
    }

  return (
    <div className='calendar'>
        <div className='calendar-header'>
            <div className='calendar-header-left'>
                <div className='calendar-arrows'>
                    <button type='button' id='calendar-arrow-left' onClick={handlePrev}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.71 6.70999C14.6175 6.61728 14.5076 6.54373 14.3867 6.49355C14.2657 6.44337 14.136 6.41754 14.005 6.41754C13.8741 6.41754 13.7444 6.44337 13.6234 6.49355C13.5024 6.54373 13.3926 6.61728 13.3 6.70999L8.71005 11.3C8.61734 11.3925 8.5438 11.5024 8.49361 11.6234C8.44343 11.7443 8.4176 11.874 8.4176 12.005C8.4176 12.136 8.44343 12.2656 8.49361 12.3866C8.5438 12.5076 8.61734 12.6175 8.71005 12.71L13.3 17.3C13.3926 17.3926 13.5025 17.466 13.6235 17.5161C13.7445 17.5662 13.8741 17.592 14.005 17.592C14.136 17.592 14.2656 17.5662 14.3866 17.5161C14.5076 17.466 14.6175 17.3926 14.71 17.3C14.8026 17.2074 14.8761 17.0975 14.9262 16.9765C14.9763 16.8556 15.0021 16.7259 15.0021 16.595C15.0021 16.4641 14.9763 16.3344 14.9262 16.2134C14.8761 16.0925 14.8026 15.9826 14.71 15.89L10.83 12L14.71 8.11999C15.1 7.72999 15.09 7.08999 14.71 6.70999Z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button type='button' id='calendar-arrow-right' onClick={handleNext}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <button onClick={resetDate} type='button' className='calendar-header-today'>
                    Aujourd'hui
                </button>
            </div>
            <span className='calendar-month-year'>
                {`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </span>
            <select onChange={option => setCalendarView(option.target.value as CalendarView)} name="calendar-view" id="calendar-header-right">
                <option value={CalendarView.MONTH}>
                    Mois
                </option>
                <option value={CalendarView.WEEK}>
                    Semaine
                </option>
                <option value={CalendarView.DAY}>
                    Jour
                </option>
            </select>
        </div>
        {generateCalendarView()}
    </div>
  )
}

export default BigCalendar