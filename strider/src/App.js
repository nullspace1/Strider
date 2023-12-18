import React from "react";
import {useQuery} from "react-query";
import './css/app.css'

const { ipcRenderer } = window.require('electron')


const App = () => {

    const fetchAthletes = async () => {
        const athletes = await ipcRenderer.invoke('GET athlete');
        return athletes;
    };

    const fetchCalendars = async () => {
        const calendars = await ipcRenderer.invoke('GET calendars');
        return calendars;
    };

    const [calendars, setCalendars] = React.useState([]);
    const [athletes, setAthletes] = React.useState([]);

    const {fetchedCalendars, statusCalendars} = useQuery('calendar', fetchCalendars);
    const {fetchedAthletes, statusAthletes} = useQuery('athlete', fetchAthletes);

    React.useEffect(() => {
        setCalendars(fetchedCalendars)
    },[calendars]);

    React.useEffect(() => {
        setAthletes(fetchedAthletes);
    },[athletes]);

    return (
        <div className='App'>
            <Calendar calendars={calendars} />
            <Athlete athletes={athletes}/>
        </div>
    );

};

function Calendar() {

    return (
        <div className='Calendar'>
            
        </div>
    )


}

function Athlete() {
    return (
        <div className='Athlete'>
           
        </div>
    )
}

export default App;
