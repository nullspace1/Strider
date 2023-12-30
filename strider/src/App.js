import React from "react";
import { useQuery } from "react-query";
import './css/app.css'
import { Calendar } from "./Calendar";

const { ipcRenderer } = window.require('electron')


const App = () => {

    const fetchAthletes = async () => {
        const athletes = await ipcRenderer.invoke('GET athlete');
        return athletes;
    };

    const fetchCalendars = async () => {
        const calendars = await ipcRenderer.invoke('GET calendar');
        return calendars;
    };

    const [calendars, setCalendars] = React.useState(null);
    const [athletes, setAthletes] = React.useState(null);

    const {  data : fetchedCalendars , status: statusCalendars } =  useQuery('calendar', fetchCalendars);
    const { data: fetchedAthletes , status: statusAthletes } = useQuery('athlete', fetchAthletes);

    React.useEffect(() => {
        if ((statusCalendars === `success` || statusAthletes === `success`)) {
            setCalendars(fetchedCalendars)
            setAthletes(fetchedAthletes)
        }
    },[fetchedCalendars,fetchedAthletes,statusAthletes,statusCalendars])

    if (calendars === null || athletes === null) {
        return <>Loading...</>
    }

    return (
        <div className='App'>
            <Calendar calendars={calendars} athletes={athletes} setCalendars={setCalendars}/>
            <Athlete athletes={athletes} />
        </div>
    );

};

function Athlete() {
    return (
        <div className='Athlete' >

        </div>
    )
}

export default App;
