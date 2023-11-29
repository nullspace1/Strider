import React from "react"
import './css/athlete.css'
import { BasicEntry, BasicField, EntryWithOptions, DistanceUnits, EntryWithUnits, WeightUnits } from "./snippets";

const { ipcRenderer } = window.require('electron')


function AthleteSection() {

    const [athleteList, setAthleteIdentifierList] = React.useState([]);
    const [athlete, setSelectedAthlete] = React.useState(null);

    const saveAthlete = async (athlete) => {
        console.log('saving')
        setSelectedAthlete(athlete);
        await ipcRenderer.invoke('save:athlete', athlete)
    }

    React.useEffect(() => {

        const getAthletes = async () => {
            const athletes = await ipcRenderer.invoke('get:athlete_identifiers');
            setAthleteIdentifierList(athletes);
        }

        getAthletes();

    })

    return (
        <div className="AthleteSelector">
            <div className="AthleteContainer">
                <AthleteList athleteList={athleteList} setSelectedAthlete={setSelectedAthlete} />
                <AthleteProperties athlete={athlete} saveAthlete={saveAthlete} />
            </div>
        </div>)

}

function AthleteList({ athleteList, setSelectedAthlete }) {

    const [selectedIndex, setIndex] = React.useState(-1)
    const [render, setRender] = React.useState(false)

    if (render) {
        return <CreateAthlete setRender={setRender} />
    }

    const selectAthlete = async (athlete) => {
        const selectedAthlete = await ipcRenderer.invoke('get:athlete_full_info', athlete)
        setSelectedAthlete(selectedAthlete)
    }

    return (
        <div className="AthleteList">
            <h2>Atletas</h2>
            <button className="button" onClick={() => setRender(true)}>Crear Atleta</button>
            {athleteList.map((athlete, index) =>
                <div className={`AthleteEntry ${selectedIndex === index ? 'selected' : ''}`} onClick={() => { selectAthlete(athlete); setIndex(index) }}>
                    {athlete.name}
                </div>
            )}
        </div>)


}

function CreateAthlete({ setRender }) {

    const [name, setName] = React.useState('');
    const [birthday, setBirthday] = React.useState('');
    const [weight, setWeight] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [gender, setGender] = React.useState('male');
    const [location, setLocation] = React.useState('');

    const handleCancel = () => {
        setRender(false);
        console.log('cancel')
    };

    const handleSave = () => {
        console.log('save')
        const athlete = {
            name: name,
            birthday: birthday,
            weight: weight,
            height: height,
            gender: gender,
            location: location
        }
        ipcRenderer.invoke('save:athlete', athlete);
        setRender(false)
    };

    return (
        <div className="CreateAthlete">
            <div className="CreateAthleteEntries">
                <BasicEntry setField={setName} entry={name} entryName={"Nombre"} />
                <BasicEntry setField={setLocation} entry={location} entryName={"Localidad"}/>
                <EntryWithUnits setField={setHeight} field={height} fieldName={"Altura"} units={DistanceUnits}/>
                <EntryWithUnits setField={setWeight} field={weight} fieldName={"Peso"} units={WeightUnits}/> 
                <EntryWithOptions setField={setGender} entryName={"Sexo"} entry={gender} options={["Masculino","Femenino"]}/>
            </div>
            <div className="CreateAthleteButtons">
                <button className="button" onClick={handleCancel}>
                    Cancelar
                </button>
                <button className="button" onClick={handleSave}>
                    Guardar
                </button>
            </div>
        </div>
    );
}

function AthleteProperties({ athlete, saveAthlete }) {

    if (athlete === null) {
        return (
            <div className="AthleteProperties">
                <div className="AthletePropertiesEmpty">
                    Seleccione un Atleta
                </div>
            </div>)
    }


    return (
        <div className="AthleteProperties">
            <h2>Propiedades de Atleta</h2>
            <div className="AthleteBasicData">
                <h2>Datos Básicos</h2>
                <div className="entry"><span className="field">Nombre:</span> <span className="value">{athlete.name}</span></div>
                <div className="entry"><span className="field">Edad:</span> <span className="value">{athlete.age}</span></div>
                <div className="entry"><span className="field">Localidad:</span> <span className="value">{athlete.location}</span></div>
            </div>

            <div className="AthleteBasicCharacteristics">
                <h2>Caracteristicas Basicas</h2>
                <div className="entry"><span className="field">Peso:</span> <span className="value">{athlete.weight}</span></div>
                <div className="entry"><span className="field">Altura:</span> <span className="value">{athlete.height}</span></div>
                <div className="entry"><span className="field">Sexo:</span> <span className="value">{athlete.gender}</span></div>
                <div className="entry"><span className="field">VO2Max:</span> <span className="value">{athlete.vo2max}</span></div>
            </div>

            <div className="AthleteStatistics">
                <h2>Estadisticas</h2>
                <div className="entry"><span className="field">Ritmo Maximo:</span> <span className="value">{athlete.ritmoMaximo}</span></div>
                <div className="entry"><span className="field">Ritmo Fondo:</span> <span className="value">{athlete.ritmoFondo}</span></div>
                <div className="entry"><span className="field">Ritmo 80%:</span> <span className="value">{athlete.ritmo80}</span></div>
            </div>

        </div>
    );

}

export { AthleteSection }