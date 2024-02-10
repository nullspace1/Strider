import React from 'react'
import { CalendarContext } from '../../App';
import { DateContext } from './calendar';
import '../../css/app.css'

function CalendarWeekSelection() {

    const calendar = React.useContext(CalendarContext)
    const date = React.useContext(DateContext)



    const getClassName = (week) => {
        return "Week" + (date.context.weekIsSelected(week) ? " Selected" : "") + (calendar.context.datehasActivitiesInWeekOf(date.context.year,week) ? " ActivityCreated" : "")
    }

    const setYear = (y) => {
        date.updateContext(date.context.setYear(y));
    }

    const setDate = (d) => {
        date.updateContext(date.context.setDate(new Date(d)));
    }

    const getNextWeek = () => {
        return date.context.getNextWeek();
    }

    const setWeek = (w) => {
        date.updateContext(date.context.setWeek(w));
    }

    return (
        <div className="CalendarWeekSelection">
            <div className="WeekList">
                {calendar.context.getWeeksInYear(date.context.year).map((w) => (
                    <div key={w} className={getClassName(w)} onClick={(e) => setWeek(w)}> {w} </div>
                ))}
            </div>
            <div className="SelectedWeekInfo">
                <div className="SelectedWeekYear">
                    <div className="SelectedWeekInfoRow"><div className="Field">Año</div> <input type="number" min={2000} max={2100} value={date.context.year} onChange={(e) => setYear(e.target.value)} /></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Desde</div> <input type="date" value={date.context.getFormattedDate(null)} onChange={(e) => setDate(e.target.value)} /> <div></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Hasta</div> <div className="Entry"><div className="SelectedWeekControlWidth">{getNextWeek()} </div></div></div>
            </div>
        </div> 
    )

}


export {CalendarWeekSelection}