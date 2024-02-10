import React from 'react'
import { AthleteContext, CalendarContext } from '../../App'
import { DateContext } from './calendar';


function CalendarActivity() {

    const calendar = React.useContext(CalendarContext);
    const date = React.useContext(DateContext);
    const athletes = React.useContext(AthleteContext);

    const createActivity = async () => {
        calendar.updateContext(await calendar.context.createActivityFor(date.context.year,date.context.week,date.context.day))
    }

    if (!calendar.context.activityExists(date.context.year,date.context.week,date.context.day)) {
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
                    {athletes.context.athletes.map((a, i) => (
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



export {CalendarActivity}