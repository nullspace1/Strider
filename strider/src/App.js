import { ActivitySection } from "./components/activity.js";
import { AthleteSection } from "./components/athlete.js";
import { Header } from "./components/header.js";
import {CalendarSection} from './components/plan.js'
import './components/css/styles.css'

const App = () => {


  return (
    <div className={'container'}>
        <Header />
        <CalendarSection/>
        <ActivitySection/>
        <AthleteSection/>
    </div>
  );
};
 
export default App;
