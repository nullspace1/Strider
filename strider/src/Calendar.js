import React from "react";
import './css/app.css';
const { ipcRenderer } = window.require('electron')




export function Calendar({ calendars, athletes, setCalendars }) {


    const [selectedCalendar, setSelectedCalendar] = React.useState(null);

    const [week, setWeek] = React.useState(1);
    const [day, setDay] = React.useState(1);


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

    const [date, setDate] = React.useState(formatDate(new Date()));

    return (
        <div className='Calendar'>
            <CalendarHeader calendars={calendars} selectedCalendar={selectedCalendar} selectCalendar={setSelectedCalendar} setCalendars={setCalendars} />
            <CalendarWeekSelection formatDate={formatDate} date={date} setDate={setDate} week={week} setWeek={setWeek} />
            <CalendarDaySelection day={day} setDay={setDay} date={date} formatDate={formatDate} />
            <CalendarActivity day={day} week={week} selectedCalendar={selectedCalendar} />
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
                    <button>Save</button>
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



function CalendarWeekSelection({ date, setDate, week, setWeek, formatDate }) {



    const getDateFromWeek = (year, week) => {
        let firstDayOfYear = new Date(year, 0, 1);
        let days = 2 + (week) * 7 - (firstDayOfYear.getDay() || 7);
        let startDateOfWeek = new Date(year, 0, days);
        return formatDate(startDateOfWeek);
    }

    function getWeekFromDate(date) {
        const givenDate = new Date(date);
        const firstDayOfYear = new Date(givenDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (givenDate - firstDayOfYear) / 86400000; // milliseconds in a day

        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    function addDaysAndFormat(date, daysToAdd) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return formatDate(newDate);
    }


    const changeYear = (y) => {
        setYear(y);
        let newDate = getDateFromWeek(y, week);
        setDate(newDate);
    }

    const changeWeek = (w) => {
        setWeek(w);
        let newDate = getDateFromWeek(year, w);
        setDate(newDate);
    }

    const changeDate = (d) => {
        setDate(d);
        let newWeek = getWeekFromDate(d);
        setWeek(newWeek);
        setYear(new Date(d).getFullYear())
    }


    const isSelected = (w) => week === w;


    const [year, setYear] = React.useState(new Date().getFullYear());
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
                    <div key={w} className={"Week" + (isSelected(w) ? " Selected" : "")} onClick={(e) => changeWeek(w)}> {w} </div>
                ))}
            </div>
            <div className="SelectedWeekInfo">
                <div className="SelectedWeekYear">
                    <div className="SelectedWeekInfoRow"><div className="Field">Año</div> <input type="number" min={2000} max={2100} value={year} onChange={(e) => changeYear(e.target.value)} /></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Desde</div> <input type="date" value={date} onChange={(e) => changeDate(e.target.value)} /> <div></div></div>
                <div className="SelectedWeekInfoRow"><div className="Field">Hasta</div> <div className="Entry"><div className="SelectedWeekControlWidth">{addDaysAndFormat(date, 7)} </div></div></div>
            </div>
        </div>
    )

}

function CalendarDaySelection({ date, formatDate, day, setDay }) {

    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const isSelected = (d) => d === day;

    const addDay = (date, days) => {
        const set_date = new Date(date);
        set_date.setDate(set_date.getDate() + days)
        return formatDate(set_date);
    }

    return (
        <div className="CalendarDaySelection">
            <div className="DaySelectionAlign">
                {days.map((d, i) => (
                    <div key={i} className="RowAlign"><div onClick={(e) => setDay(i + 1)} className={"Field" + (isSelected(i + 1) ? " Selected" : "")}>{d}</div><div onClick={(e) => setDay(i + 1)} className={"Field" + (isSelected(i + 1) ? " Selected" : "")}> {addDay(date, i + 1)}</div></div>
                ))}
            </div>
        </div>
    )
}


function CalendarActivity({ day, week, selectedCalendar }) {




    if (selectedCalendar === null) {
        return (
            <div className="CalendarActivity">
                <h1>Select a calendar</h1>
            </div>
        )
    }

    
    return (
        <div className="CalendarActivity">
            <h1></h1>
        </div>
    )

}
