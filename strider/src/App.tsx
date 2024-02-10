import React from "react";
import { useQuery } from "react-query";
import './css/app.css'
import { CalendarSection } from "./components/calendar/calendar";
import { CalendarContextManager } from "./classes/calendar_context_manager";
import { AthleteContextManager, Athlete } from "./classes/athlete_context_manager";
import { AthleteSection } from "./components/athlete/Athlete";
import { MainInterface } from "./classes/maininterface";
import { Context } from "./classes/context";

export const ipcRenderer = window.require('electron').ipcRenderer

export const CalendarContext= React.createContext(null as unknown as Context<CalendarContextManager>);
export const AthleteContext = React.createContext(null as unknown as Context<AthleteContextManager>)

const App = () => {

    const appInterface = new MainInterface(ipcRenderer);

    const fetchAthletes = async () => {
        const athletes = await appInterface.getAthletes();
        return athletes;
    };

    const fetchCalendars = async () => {
        const calendars = await appInterface.getCalendars();
        return calendars;
    };

    const [calendarContext, setCalendarContext] = React.useState(new CalendarContextManager([],null,appInterface));
    const [athleteContext, setAthleteContext] = React.useState(new AthleteContextManager([],null, appInterface));

    const { data: fetchedCalendars, status: statusCalendars } = useQuery('calendar', fetchCalendars);
    const { data: fetchedAthletes, status: statusAthletes } = useQuery('athlete', fetchAthletes);

    React.useEffect(() => {
        if (statusCalendars === "success") {
            setCalendarContext(calendarContext.reload(fetchedCalendars))
        }
        if (statusAthletes === 'success') {
            setAthleteContext(athleteContext.reload(fetchedAthletes))
        }
    }, [fetchedCalendars,fetchedAthletes, statusAthletes, statusCalendars])


    if (statusCalendars === 'loading' || statusAthletes === 'loading') {
        return <>Loading...</>
    }

    return (
        <div className='App'>
            <CalendarContext.Provider value={{ context: calendarContext, updateContext: setCalendarContext }}>
                <AthleteContext.Provider value={{ context: athleteContext, updateContext: setAthleteContext }}>
                    <CalendarSection />
                    <AthleteSection />
                </AthleteContext.Provider>
            </CalendarContext.Provider>
        </div>
    );

};



export default App;
