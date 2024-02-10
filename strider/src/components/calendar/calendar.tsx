
import { DateManager } from "../../classes/date_manager";
import { CalendarActivity } from "./activity";
import { CalendarDaySelection } from "./day_selection";
import { CalendarHeader } from "./header";
import { CalendarWeekSelection } from "./week_selection";
import React from "react";
import '../../css/app.css'
import { Context } from "../../classes/context";

export const DateContext = React.createContext(null as unknown as Context<DateManager>)

export function CalendarSection() {

    const [date, setDate] = React.useState(new DateManager())

    return (
        <div className='Calendar'>
            <DateContext.Provider value={{context: date, updateContext: setDate}}>
                <CalendarHeader/>
                <CalendarWeekSelection/>
                <CalendarDaySelection/>
                <CalendarActivity/>
            </DateContext.Provider>
        </div>
    );


}