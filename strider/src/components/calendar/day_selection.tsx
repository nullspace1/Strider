import React from "react";
import { DateContext } from "./calendar";
import { CalendarContext } from "../../App";


function CalendarDaySelection() {

    const date = React.useContext(DateContext);
    const calendar = React.useContext(CalendarContext);

    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const setDay = (d) => {
        date.updateContext(date.context.setDay(d));
    }

    const getDayClassName = (d) => {
        return "Field" + ((date.context.dayIsSelected(d) ? " Selected" : "") + (calendar.context.dateHasActivitiesInDayOf(date.context.year,date.context.week,d) ? " ActivityCreated" : ""))
    }

    return (
        <div className="CalendarDaySelection">
            <div className="DaySelectionAlign">
                {days.map((d, i) => (
                    <div key={i} className="RowAlign"><div onClick={(e) => setDay(i + 1)} className={getDayClassName(i+1)}>{d}</div><div onClick={(e) => setDay(i + 1)} className={getDayClassName(i+1)}> {date.context.getShiftedDate(i + 1)}</div></div>
                ))}
            </div>
        </div>
    )
}



export {CalendarDaySelection}