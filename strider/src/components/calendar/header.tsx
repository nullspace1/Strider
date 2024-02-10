import React from "react";
import { CalendarContext } from "../../App";


function CalendarHeader() {

    const [name, setName] = React.useState("");

    const calendar = React.useContext(CalendarContext)

    const changeCalendar = async (index) => {
        calendar.updateContext(await calendar.context.switchCalendar(index))
    }

    const deleteCalendar = async () => {
        calendar.updateContext(await calendar.context.deleteActiveCalendar())
    }

    const createCalendar = async (name) => {
        calendar.updateContext(await calendar.context.createCalendar(name))
    }


    return (
        <div className="CalendarHeader">
            <div className="CalendarHeaderComponents">
                <div className="CalendarHeaderList">
                    <select className="select" onChange={(e) => changeCalendar(e.target.value)}>
                        {calendar.context.getCalendarNames().map((n, i) => (
                            <option key={i} value={i}>{n}</option>
                        ))}
                    </select>
                    <button onClick={deleteCalendar}>Delete</button>
                    <div className="CalendarHeaderCreateCalendarButton">
                        <input value={name} onChange={(e) => setName(e.target.value)}></input>
                        <button onClick={() => createCalendar(name)}> Create</button>
                    </div>

                </div>
            </div>

        </div>
    )

}

export {CalendarHeader}