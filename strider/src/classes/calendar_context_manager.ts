
import { Activity, ActivityData } from "./activity";
import { Calendar, CalendarData } from "./calendar";
import { MainInterface } from "./maininterface";


class CalendarContextManager {
   
   

    calendars: Calendar[];
    selectedCalendar: Calendar | null;
    mainInterface: MainInterface

    constructor(calendars: Calendar[], selectedCalendar: Calendar | null, mainInterface: MainInterface) {
        this.calendars = calendars
        this.selectedCalendar = selectedCalendar
        this.mainInterface = mainInterface
        if (this.calendars.length > 0 && this.selectedCalendar === null) this.selectedCalendar = this.calendars[0];
    }

    newInstance() {
        return new CalendarContextManager(this.calendars, this.selectedCalendar, this.mainInterface);
    }

    reload(calendars: Calendar[]) {
        this.calendars = calendars;
        return this.newInstance();
    }

    async switchCalendar(index: number) {
        this.calendars =  await this.mainInterface.saveCalendar(this.selectedCalendar);
        this.selectedCalendar = this.calendars[index]
        return this.newInstance();
    }

    async deleteActiveCalendar() {
        if (this.selectedCalendar === null) return this.newInstance();
        this.calendars = await this.mainInterface.deleteCalendar(this.selectedCalendar);
        console.log(this.calendars)
        this.selectedCalendar = null;
        return this.newInstance();
    }

    async createCalendar(name: string) {
        const calendar = new Calendar(new CalendarData(name),[]);
        this.calendars = await this.mainInterface.saveCalendar(calendar);
        return this.newInstance();
    }

    
    async createActivityFor(year : number, week : number, day : number) {
        if (this.selectedCalendar === null) return this.newInstance();
        const activity = new Activity(new ActivityData(year,week,day,this.selectedCalendar.getData().id));
        await this.mainInterface.saveActivity(activity);
        this.selectedCalendar.addActivity(activity);
        return this.newInstance();
    }


    getCalendarNames() {
        return this.calendars.map(c => c.getName())
    }

    datehasActivitiesInWeekOf(year : number, week : number) {
        return this.selectedCalendar === null ? false : this.selectedCalendar.findActivity(year,week,null) !== null;
    }

    dateHasActivitiesInDayOf(year : number, week : number, day : number) {
        return this.selectedCalendar === null ? false : this.selectedCalendar.findActivity(year,week,day) !== null;
    }

    getWeeksInYear(year: number): number[] {
        const firstDayOfYear = new Date(year, 0, 1);
        const lastDayOfYear = new Date(year, 11, 31);
        const firstDayOfWeek = firstDayOfYear.getDay();
        let firstWeek = (firstDayOfWeek === 0 || firstDayOfWeek > 4) ? 0 : 1;
        
        const daysInYear = Math.floor((lastDayOfYear.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        let totalWeeks = Math.ceil((daysInYear - (7 - firstDayOfWeek + 1)) / 7);
        
        if (firstDayOfWeek === 4 || (firstDayOfWeek === 3 && this.isLeapYear(year))) {
            totalWeeks += 1;
        }
        
        totalWeeks += firstWeek;
        
        return Array.from({length: totalWeeks}, (_, i) => i + firstWeek);
    }
    
   isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    activityExists(year, week, day) : boolean{
        return this.selectedCalendar === null ? false : this.selectedCalendar.activityExists(year,week,day);
    }
    


}
export { CalendarContextManager}

