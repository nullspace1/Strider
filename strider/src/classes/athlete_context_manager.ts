import { MainInterface } from "./maininterface";


class AthleteContextManager {
    

    athletes : Athlete[];
    selectedAthlete : Athlete | null;
    mainInterface : MainInterface

    constructor(athletes : Athlete[], selectedAthlete : Athlete | null, mainInterface : MainInterface){
        this.athletes = athletes;
        this.selectedAthlete = selectedAthlete;
        this.mainInterface = mainInterface;
    }

    reload(athletes: any) {
        this.athletes = athletes.map(a => new Athlete(a));
        return this;
    }

}

class Athlete {

    name : string

    constructor(props){
        this.name = props.a;
    }

}

export {AthleteContextManager, Athlete}

