class DateManager {

    

    year : number;
    week : number;
    day : number;

    constructor(year?,week?,day?){
        this.year = year !== undefined ? year : new Date().getFullYear();
        this.week = week !== undefined ? week : 1;
        this.day = day !== undefined ? day : 1;
    }

    newInstance() {
        return new DateManager(this.year,this.week,this.day)
    }



    setWeek(w){
        this.week = w;
        return this.newInstance();
    }

    setYear(y){
        this.year = y;
        return this.newInstance();
    }

    setDay(d){
        this.day = d;
        return this.newInstance();
    }

    setDate(d){
        this.year = d.getFullYear();
        this.week = this.getWeekFromDate(d);
        return this.newInstance();
    }

    getNextWeek(){
        return this.getFormattedDate(new Date(this.year,0,this.week * 7));
    }


    getDate(){
        return new Date(this.year,0,this.day + (this.week - 1) * 7)
    }

    weekIsSelected(week) {
        return this.week === week;
    }

    dayIsSelected(day) {
        return this.day === day;
    }

    getShiftedDate(day): import("react").ReactNode {
        return this.getFormattedDate(new Date(this.year, 0, (this.week - 1) * 7 + day))
    }


    getFormattedDate(date : Date | null) {

        if (date === null){
            date = this.getDate()
        }

        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');

    }

    getWeekFromDate(date) {
        const givenDate = new Date(date);
        const firstDayOfYear = new Date(givenDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (givenDate.valueOf() - firstDayOfYear.valueOf()) / 86400000; // milliseconds in a day

        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
    }

    sameYearAs(date){
        return date.year === this.year;
    }

    sameWeekAs(date){
        return date.week === this.week;
    }


}

export {DateManager}