
function CalendarSection(){
    return (<>
    <CalendarSelectorPanel/>
    <Calendar/> 
    </>)
}

function CalendarSelectorPanel (){
    return (
    <div className="PlanSelectorPanel">PlanSelectorPanel</div>
    )
}

function Calendar (){
    return (
    <div className="Calendar">Calendar</div>
    )
}

export {CalendarSection}