
import { Activity, ActivityData } from "./activity";
import { Entity } from "./entity";
import { IDENTIFIER } from "./identifiers";

class CalendarData {
    name: string;
    id: number;

    constructor(name: string) {
        this.name = name;
    }
}

class Calendar extends Entity<CalendarData> {
   

    activities: Activity[];

    constructor(data: CalendarData, activities: Activity[]) {
        super(data, IDENTIFIER.CALENDAR);
        this.activities = activities;
    }


    findActivity(year: number, week: number, day: number) {
        const activity = this.activities.find((v) => v.match(year, week, day))
        return activity === undefined ? null : activity;
    }

    addActivity(activity: Activity) {
        this.activities.push(activity)
    }

    getName() {
        return this.getData().name;
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

        return Array.from({ length: totalWeeks }, (_, i) => i + firstWeek);
    }

    isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    activityExists(year: number, week: number, day: number): boolean {
        return this.activities.filter(a => a.match(year,week,day)).length === 1
    }


}

export { Calendar, CalendarData }