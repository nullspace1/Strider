import React from "react"
import { PaceUnits, DeletableField, BasicEntry, BasicField, EntryWithOptions, DistanceUnits, EntryWithUnits, WeightUnits, EditableField, FieldWithUnits, DateEntry } from "./snippets";
import './css/athlete.css'

const { ipcRenderer } = window.require('electron')

function Athlete({ athleteList, setAthleteIdentifierList }) {


    const [athlete, setSelectedAthlete] = React.useState(null);
    const [createAthleteForm, toggleAthleteCreateForm] = React.useState(false)

    React.useEffect(() => {

        const getAthletes = async () => {
            const athletes = await ipcRenderer.invoke('get:athlete_identifiers');
            setAthleteIdentifierList(athletes);
        }

        getAthletes();

    }, [athleteList])

    const saveAthlete = async (athlete) => {
        setSelectedAthlete(athlete)
        await ipcRenderer.invoke('save:athlete', athlete)
    }

    return (
        <div className="AthleteSection Section">
            {createAthleteForm ? <CreateAthlete setAthleteIdentifierList={setAthleteIdentifierList} toggle={toggleAthleteCreateForm} /> : <AthleteList athleteList={athleteList} setSelectedAthlete={setSelectedAthlete} toggle={toggleAthleteCreateForm} />}
            <AthleteProperties athlete={athlete} saveAthlete={saveAthlete} />
        </div>)

}

function AthleteList({ athleteList, setSelectedAthlete, toggle }) {

    const [selectedIndex, setIndex] = React.useState(-1)


    React.useEffect(() => {
        const getAthlete = async () => {
            if (selectedIndex >= 0) {
                const selectedAthlete = await ipcRenderer.invoke('get:athlete_full_info', athleteList[selectedIndex])
                setSelectedAthlete(selectedAthlete)
            } else {
                setSelectedAthlete(null)
            }
        }
        getAthlete()
    }, [selectedIndex])

    const deleteAthlete = async (athlete) => {
        await ipcRenderer.invoke('delete:athlete', athlete).then(() => {
            setIndex(-1)
        })
    }

    return (
        <div className="SubSection">
            <h2>Atletas</h2>
            <button onClick={() => toggle(true)}>Crear Atleta</button>
            <p></p>
            <div className="List">
                {athleteList.map((athlete, index) =>
                    <DeletableField fieldName={athlete.name} onDelete={() => deleteAthlete(athlete)} id={athlete.id} selectedIndex={selectedIndex} onSelect={() => setIndex(index)} index={index} />
                )}
            </div>
        </div>)

}

function CreateAthlete({ toggle, setAthleteIdentifierList }) {

    const [name, setName] = React.useState('');
    const [birthday, setBirthday] = React.useState('');
    const [weight, setWeight] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [gender, setGender] = React.useState('Masculino');
    const [location, setLocation] = React.useState('');

    const handleCancel = () => {
        toggle(false);
    };

    const handleSave = async () => {
        const athlete = {
            name: name,
            birthday: birthday,
            weight: weight,
            height: height,
            gender: gender,
            location: location
        }
        ipcRenderer.invoke('save:athlete', athlete);
        const new_athlete_list = await ipcRenderer.invoke('get:athlete_identifiers')
        setAthleteIdentifierList(new_athlete_list);
        toggle(false)
    };

    return (
        <div className="SubSection CreateAthlete">
            <div className="CreateAthleteEntries">
                <BasicEntry setEntry={setName} entry={name} entryName={"Nombre"} />
                <BasicEntry setEntry={setLocation} entry={location} entryName={"Localidad"} />
                <DateEntry setEntry={setBirthday} entry={birthday} entryName={"Fecha de Nacimiento"} />
                <EntryWithUnits setEntry={setHeight} entry={height} entryName={"Altura"} units={DistanceUnits} />
                <EntryWithUnits setEntry={setWeight} entry={weight} entryName={"Peso"} units={WeightUnits} />
                <EntryWithOptions setEntry={setGender} entryName={"Sexo"} entry={gender} options={["Masculino", "Femenino"]} />
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
            <div className="SubSection AthleteProperties">
                <div className="AthletePropertiesEmpty">
                    Seleccione un Atleta
                </div>
            </div>)
    }

    const updateField = (fieldName, value) => {
        const newAthlete = structuredClone(athlete)
        newAthlete[fieldName] = value
        saveAthlete(newAthlete)
    }

    return (
        <div className="SubSection AthleteProperties">
            <h3>Propiedades de Atleta</h3>
            <div className="AthleteBasicData">
                <h2>Datos Básicos</h2>
                <EditableField componentWhenEditable={<BasicEntry entry={athlete.name} entryName={"Nombre"} setEntry={(name) => updateField('name', name)} />} componentWhenNotEditable={<BasicField field={athlete.name} fieldName={'Nombre'} />} />
                <BasicField field={athlete.age} fieldName={"Edad"} />
                <EditableField componentWhenEditable={<BasicEntry entryName={"Localidad"} entry={athlete.weight} setEntry={(name) => updateField('name', name)} />} componentWhenNotEditable={<BasicField field={athlete.location} fieldName={'Localidad'} />} />
            </div>

            <div className="AthleteBasicCharacteristics">
                <h2>Caracteristicas Basicas</h2>
                <EditableField componentWhenNotEditable={<FieldWithUnits field={athlete.weight} fieldName={"Peso"} units={WeightUnits} />} componentWhenEditable={<EntryWithUnits entry={athlete.weight} entryName={'Peso'} units={WeightUnits} setEntry={(weight) => updateField('weight', weight)} />} />
                <EditableField componentWhenNotEditable={<FieldWithUnits field={athlete.height} fieldName={"Altura"} units={DistanceUnits} />} componentWhenEditable={<EntryWithUnits entry={athlete.height} entryName={'Altura'} setEntry={(height) => updateField('height', height)} units={DistanceUnits} />} />
                <EditableField componentWhenEditable={<EntryWithOptions setEntry={(gender) => updateField('gender', gender)} entryName={"Sexo"} entry={athlete.gender} options={["Masculino", "Femenino"]} />} componentWhenNotEditable={<BasicField field={athlete.gender} fieldName={'Sexo'} />} />
                <BasicField field={athlete.vo2max} fieldName="VO2Max"/>
            </div>

            <div className="AthleteStatistics">
                <h2>Estadisticas</h2>
                <FieldWithUnits field={athlete.ritmoMaximo} fieldName="Ritmo Maximo" units={PaceUnits} />
                <FieldWithUnits field={athlete.ritmoFondo} fieldName="Ritmo Fondo" units={PaceUnits} />
                <FieldWithUnits field={athlete.ritmo80} fieldName="Ritmo 80%" units={PaceUnits} />
            </div>

        </div>
    );

}

export { Athlete }