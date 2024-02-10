import { Entity } from "./entity";
import { IDENTIFIER } from "./identifiers";

class ActivityData {
    name: string;
    week: number;
    year: number;
    day: number;
    calendar_id: number;

    constructor(year : number,week : number,day : number,calendar_id : number){
        this.year = year;
        this.week = week;
        this.day = day;
        this.calendar_id = calendar_id;
        this.name = ''
    }
}

class Activity extends Entity<ActivityData> {

    constructor(data : ActivityData) {
        super(data,IDENTIFIER.ACTIVITY);
    }

    match(year : number,week : number,day : number) : boolean {
        return (this.getData().day === day || day === null)  && (this.getData().week === week || week === null) && (this.getData().year === year || year === null);
    }

}

export {Activity,ActivityData}