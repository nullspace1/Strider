
import { Athlete} from "./components/athlete.js";
import { Header } from "./components/header.js";
import {Calendar} from './components/calendar.js'
import React from "react";

import './components/css/app.css'

const App = () => {

  const [athleteList, setAthleteIdentifierList] = React.useState([]);

  return (
    <div className={'App'}>
        <Header/>
        <Calendar athleteList={athleteList}/>
        <Athlete athleteList={athleteList} setAthleteIdentifierList={setAthleteIdentifierList}/>
    </div>
  );
};
 
export default App;
