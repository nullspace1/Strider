import React from "react";
import './css/app.css';
const { ipcRenderer } = window.require('electron')




export function Calendar({ calendars, athletes, setCalendars }) {

    function formatDate(date) {

        let d = new Date(date),
            month = '' + (d.getMonth() + 1), // Months are zero indexed
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;


        return [year, month, day].join('-');
    }

    const [selectedCalendar, setSelectedCalendar] = React.useState(null);

    const [week, setWeek] = React.useState(1);
    const [day, setDay] = React.useState(1);
    const [year, setYear] = React.useState(new Date().getFullYear());

    const [date, setDate] = React.useState(formatDate(new Date()));

    const propagateUpdate = () => {
        if (selectedCalendar !== null) {
            const calendarsUpdated = calendars.map(c => c.id === selectedCalendar.id ? { ...c, activities: selectedCalendar.activities } : c);
            setCalendars(calendarsUpdated)
        }
    }

    React.useEffect(() => {
        setDate(formatDate(new Date(year, 0, day + (week - 1) * 7)))
    }, [week, day, year])



    return (
        <div className='Calendar'>
            <CalendarHeader calendars={calendars} selectedCalendar={selectedCalendar} selectCalendar={setSelectedCalendar} setCalendars={setCalendars} />
            <CalendarWeekSelection formatDate={formatDate} date={date} setDate={setDate} week={week} setWeek={setWeek} calendar={selectedCalendar} year={year} setYear={setYear} />
            <CalendarDaySelection day={day} setDay={setDay} date={date} week={week} setDate={setDate} formatDate={formatDate} selectedCalendar={selectedCalendar} year={year} />
            <CalendarActivity selectedCalendar={selectedCalendar} setSelectedCalendar={setSelectedCalendar} athletes={athletes} date={date} propagateUpdate={propagateUpdate} />
        </div>
    );


}

function CalendarHeader({ calendars, selectedCalendar, selectCalendar, setCalendars }) {

    const [name, setName] = React.useState("");

    const changeCalendar = (index) => {
        selectCalendar(calendars[index]);
        setName(selectedCalendar.name);
    }

    const deleteCalendar = async () => {
        if (selectedCalendar !== null) {
            ipcRenderer.invoke('DELETE calendar', selectedCalendar.id)
            const calendarsWithoutDeletedCalendar = calendars.filter(c => !(c.id === selectedCalendar.id))
            setCalendars(calendarsWithoutDeletedCalendar);
            selectCalendar(null)
        }
    }

    const createCalendar = async (name) => {
        const newCalendar = await ipcRenderer.invoke('CREATE calendar', name);
        setCalendars([...calendars, newCalendar])
    }

    React.useEffect(() => {
        selectCalendar(calendars[0])
        if (calendars[0] === undefined) {
            selectCalendar(null)
        }
    }, [calendars, selectCalendar])



    return (
        <div className="CalendarHeader">
            <div className="CalendarHeaderComponents">
                <div className="CalendarHeaderList">
                    <select className="select" onChange={(e) => changeCalendar(e.target.value)}>
                        {calendars.map((c, i) => (
                            <option key={i} value={i}>{c.name}</option>
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



function CalendarWeekSelection({ week, setWeek, year, setYear, date, setDate, formatDate, calendar }) {

    function getWeekFromDate(date) {
        const givenDate = new Date(date);
        const firstDayOfYear = new Date(givenDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (givenDate - firstDayOfYear) / 86400000; // milliseconds in a day

        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
    }

    const weekHasActivities = (calendar, year, w) => {

        if (calendar == null) return false;
        
        const activities = calendar.activities;
        return activities.keys().find(a => {
            const year_found = new Date(a).getFullYear();
            const week_found = getWeekFromDate(a);
            return year === year_found && w === week_found;
        }) !== undefined;
    }

    function addDaysAndFormat(date, daysToAdd) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return formatDate(newDate);
    }

    const changeDate = (d) => {
        setDate(d);
        setWeek(getWeekFromDate(d));
        setYear(new Date(d).getFullYear())
    }


    const isSelected = (w) => week === w;

    const [weeksOfYear, setList] = React.useState([]);

    React.useEffect(() => {

        function getWeeksInYear(year) {
            let lastDayOfYear = new Date(year, 11, 31);
            let weekNumber = Math.ceil(((lastDayOfYear - new Date(year, 0, 1)) / 86400000 + 1) / 7);
            if (new Date(year, 11, 31).getDay() < 4) {
                weekNumber = weekNumber === 1 ? 52 : weekNumber - 1;
            }

            return weekNumber;
        }

        const getWeeks = () => {
            const list = []
            for (let i = 0; i < getWeeksInYear(year); i++) {
                list.push(i + 1);
            }
            return list;
        }

        setList(getWeeks());
    }, [year])


    return (
        <div className="CalendarWeekSelection">
            <div className="WeekList">
                {weeksOfYear.map((w) => (
                    <div key={w} className={"Week" + (isSelected(w) ? " Selected" : "") + (weekHasActivities(calendar, year, w) ? " ActivityCreated" : "")} onClick={(e) => setWeek(w)}> {w} </div>
                ))}
            </div>
            <div className="SelectedWeekInfo">
                <div className="SelectedWeekYear">
                    <div className="SelectedWeekInfoRow"><div className="Field">Año</div> <input type="number" min={2000} max={2100} value={year} onChange={(e) => setYear(e.target.value)} /></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Desde</div> <input type="date" value={date} onChange={(e) => changeDate(e.target.value)} /> <div></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Hasta</div> <div className="Entry"><div className="SelectedWeekControlWidth">{addDaysAndFormat(date, 7)} </div></div></div>
            </div>
        </div>
    )

}

function CalendarDaySelection({year, week, day, setDay, date, formatDate, selectedCalendar}) {

    const dayHasActivity = (calendar, d) => {
        if (calendar == null) return false;
        const activity = calendar.activities.get(formatDate(new Date(year, 0, (week -1 ) * 7 + d)));
        return activity !== undefined;
    }

    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const isSelected = (d) => d === day;

    const addDay = (date, days) => {
        function getMonday(date) {
            let result = new Date(date);
            let dayOfWeek = result.getDay();
            let difference =  1 - dayOfWeek;
            result.setDate(result.getDate() + difference);
        
            return result;
        }
        const set_date = new Date(getMonday(date));
        set_date.setDate(set_date.getDate() + days - 1)
        return formatDate(set_date);
    }

    return (
        <div className="CalendarDaySelection">
            <div className="DaySelectionAlign">
                {days.map((d, i) => (
                    <div key={i} className="RowAlign"><div onClick={(e) => setDay(i + 1)} className={"Field" + ((isSelected(i + 1) ? " Selected" : "") + (dayHasActivity(selectedCalendar, i + 1) ? " ActivityCreated" : ""))}>{d}</div><div onClick={(e) => setDay(i + 1)} className={"Field" + (isSelected(i + 1) ? " Selected" : "") + (dayHasActivity(selectedCalendar,i + 1) ? " ActivityCreated" : "")}> {addDay(date, i + 1)}</div></div>
                ))}
            </div>
        </div>
    )
}


function CalendarActivity({ selectedCalendar, setSelectedCalendar, athletes, date, propagateUpdate }) {

    const createActivity = async () => {
        const activity = await ipcRenderer.invoke("CREATE activity", selectedCalendar.id, date)
        const activities = selectedCalendar.activities
        activities.set(date, activity)
        setSelectedCalendar({ ...selectedCalendar, activities: activities })
        propagateUpdate()
    }


    if (selectedCalendar === null) {
        return (
            <div className="CalendarActivityEmpty">
                <h1>Select a calendar</h1>
            </div>
        )
    }

    if (selectedCalendar === undefined || selectedCalendar.activities.get(date) === undefined) {
        return (
            <div className="CalendarActivityEmpty">
                <button onClick={(e) => createActivity()}>Create Activity</button>
            </div>
        )
    }

    return (
        <div className="CalendarActivity">
            <div className="CalendarActivityHeader">
                <input />
            </div>
            <div className="CalendarActivityBody">
                <div className="ActivityBodyAthleteColumn">
                    <div className="AthleteColumnHeader">
                        Atleta
                    </div>
                    {athletes.map((a, i) => (
                        <div className="AthleteColumnCell">

                        </div>
                    ))}
                </div>
                <div className="ActivityBodyAthleteColumn">

                </div>
            </div>
        </div>
    )

}
