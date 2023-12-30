import React from "react"
import './css/calendar.css'
import { DeletableField } from "./snippets"

const { ipcRenderer } = window.require('electron')

function Calendar({ athleteList }) {

    const [calendar, setCalendar] = React.useState(null)

    return (
        <div className="Section Calendar">
            <ListOfCalendars calendar={calendar} setCalendar={setCalendar} />
            <SelectedCalendarInfo calendar={calendar} setCalendar={setCalendar} athleteList={athleteList} />
        </div>
    )

}

function ListOfCalendars({ calendar, setCalendar }) {

    const [calendarIdentifierLists, setCalendarIdentifiersList] = React.useState([])
    const [newCalendarName, setNewCalendarName] = React.useState('')

    const getIdentifierList = async () => {
        const identifiersList = await ipcRenderer.invoke('get:calendar_identifiers_list')
        setCalendarIdentifiersList(identifiersList)
    }

    React.useEffect(() => {
        getIdentifierList();
    }, [])


    const selectCalendar = (identifier) => {
        if (identifier === null) {
            setCalendar(null);
            return
        }
        ipcRenderer.invoke('get:full_calendar_info', identifier).then((calendar) => {
            setCalendar(calendar)
        })
    }

    const saveNewCalendar = (newCalendarName) => {
        ipcRenderer.invoke('save:calendar', newCalendarName).then(getIdentifierList())
    }

    return (
        <div className="SubSection ListOfCalendars">
            <h2> Calendarios Armados </h2>
            <CreateCalendar saveNewCalendar={saveNewCalendar} newCalendarName={newCalendarName} setNewCalendarName={setNewCalendarName} />
            <ListOfAvailableCalendars getIdentifierList={getIdentifierList} calendarIdentifierLists={calendarIdentifierLists} selectCalendar={selectCalendar} />
        </div>
    )
}

function CreateCalendar({ saveNewCalendar, newCalendarName, setNewCalendarName }) {
    return (
        <div className='CreateCalendar'>
            <input type="text" onChange={(e) => setNewCalendarName(e.target.value)} value={newCalendarName} />
            <button onClick={() => { saveNewCalendar(newCalendarName) }} > Crear</button>
            <p></p>
        </div>
    )
}

function ListOfAvailableCalendars({ getIdentifierList, selectCalendar, calendarIdentifierLists }) {

    const [selectedIndex, setIndex] = React.useState(-1)

    React.useEffect(() => {
        const getCalendar = async () => {
            if (selectedIndex >= 0) {
                selectCalendar(calendarIdentifierLists[selectedIndex])
            } else {
                selectCalendar(null)
            }
        }
        getCalendar()
    }, [selectedIndex])


    const deleteCalendar = (calendar) => {
        ipcRenderer.invoke('delete:calendar', calendar).then(setIndex(-1))
        getIdentifierList()
    }

    return (
        <div className="List AvailableCalendars">
            {calendarIdentifierLists.map((identifier, index) => (
                <>
                    <DeletableField fieldName={identifier.name} id={index} index={index} onDelete={() => deleteCalendar(identifier)} onSelect={() => setIndex(index)} selectedIndex={selectedIndex} />
                </>
            ))}
        </div>
    )
}

function SelectedCalendarInfo({ athleteList, calendar, setCalendar }) {

    const [selectedWeek, setSelectedWeek] = React.useState(-1)
    const [selectedDay, setSelectedDay] = React.useState(-1)
    const [activity, setActivity] = React.useState(null)

    React.useEffect(() => {
        if (selectedWeek !== -1 && selectedDay !== -1 && calendar !== null) {
            setActivity(calendar.activities[selectedWeek][selectedDay])
        }
    }, [selectedDay, selectedWeek])

    return (
        <>
            <div className="SubSection SelectedCalendar">
                <WeekSelection selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />
                <DayOfWeekSelection selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </div>

            <Activity athleteList={athleteList} activity={activity} setActivity={setActivity} />
        </>
    )
}

function WeekSelection({ selectedWeek, setSelectedWeek }) {
    const availableWeeks = Array.from(Array(52).keys());

    const handleClick = (week) => {
        setSelectedWeek(week);
    }

    return (
        <div className="SubSection WeekSelection">
            <h4>Seleccion de Semana</h4>
            <div className="List">
                {availableWeeks.map((week) => (
                    <div
                        key={week}
                        className={`Box${week === selectedWeek ? 'active' : ''}`}
                        onClick={() => handleClick(week)}
                    >
                        {week + 1}
                    </div>

                ))}
            </div>
        </div>
    )
}

function DayOfWeekSelection({ selectedDay, setSelectedDay }) {

    const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
    const nameOfDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const handleClick = (day) => {
        setSelectedDay(day);
    }

    return (
        <div className="SubSection DayOfWeekSelection">
            <h4>Seleccion de Dia de Semana</h4>
            <div className="List">
                {daysOfWeek.map((day, index) => (
                    <div
                        key={day}
                        className={`Box${day === selectedDay ? 'active' : ''}`}
                        onClick={() => handleClick(day)}
                    >
                        {nameOfDays[index]}
                    </div>
                ))}
            </div>
        </div>
    );
}


function Activity({ athleteList, activity, setActivity }) {
    return (
        <>
            <ActivityStatisticsPanel athleteList={athleteList} />
            <ActivityPanel athleteList={athleteList} activity={activity} setActivity={setActivity} />
        </>
    )
}

function ActivityStatisticsPanel({ athleteList }) {

    return (
        <div className="SubSection ActivityStatisticsPanel">

        </div>
    )
}

function ActivityPanel({ athleteList, activity, setActivity }) {

    React.useEffect(() => {

    }, [activity])

    const [maxLaps, setMaxLaps] = React.useState(activity.maxNumberOfLaps)
    

    return (
        <div className="SubSection ActivityPanel">
            <table>
                <thead>
                    <tr>Nombre</tr>
                </thead>
            {activity.info.map((athleteActivity) => <>
{athleteActivity}
            </>)}
            </table>
        </div>
    )
}

export { Calendar }