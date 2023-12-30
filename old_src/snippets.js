import React from 'react';
import './css/app.css'
export const DistanceUnits = {
  default: 'meter',
  meter: {
    name: 'm',
    scale: 1,
  },
  kilometer: {
    name: 'km',
    scale: 1/1000,
  },
  mile: {
    name: 'ml',
    scale: 1/1609.34,
  },
  centimeter: {
    name: 'cm',
    scale: 100
  },
};

export const WeightUnits = {
  default: 'kilogram',
  kilogram: {
    name: 'kg',
    scale: 1,
  },
  pound: {
    name: 'pd',
    scale: 1/0.453592,
  },
  gram: {
    name: 'g',
    scale: 1000,
  },
};

export const PaceUnits = {
  default: 'min/km',
  'min/km': {
    name: 'min/km',
    scale: 1,
  },
  'min/mi': {
    name: 'min/mi',
    scale: 1.60934, // 1 milla es aproximadamente 1.60934 kilómetros
  },
  'sec/m': {
    name: 'sec/m',
    scale: 16.6667, // 1 min/km es igual a 16.6667 sec/m (1000 m en 60 min)
  },
};



function BasicField({ field, fieldName }) {
  return (
    <div className="entry"><span className="field">{fieldName}:</span> <span className="value">{field}</span></div>
  )
}

function DeletableField({id,fieldName, onDelete, onSelect, index, selectedIndex}){
  return (
    <div className="selectable">
    <div key={id} className={`item${selectedIndex === index ? 'selected' : ''}`} onClick={() => {onSelect()}}>
                    {fieldName}
    </div>
        <button onClick={ (e) => onDelete()}>Delete</button>
    </div>
  )
}




function FieldWithUnits({ field, fieldName, units }) {

  const ROUNDING_FACTOR = 100

  const [selectedUnit, setSelectedUnit] = React.useState(units.default);


  return (
    <div className="entry">
      <span className="field">{fieldName}:</span>
      <span className="value">
        {Math.round(units[selectedUnit].scale * field * ROUNDING_FACTOR) / ROUNDING_FACTOR} {selectedUnit.name}
      </span>
      <select value={selectedUnit} onChange={(e) => {setSelectedUnit(e.target.value)}}>
        {Object.keys(units).map((unitKey) => (
          <option key={unitKey} value={unitKey}>
            {units[unitKey].name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EntryWithOptions({ entry, entryName, options, setEntry}) {
  return (<div className="entry">
    <span className="field">{entryName}:</span>
    <select value={entry} onChange={(e) => setEntry(e.target.value)}>
      {options.map((o, index) => <option key={index} value={o}>{o}</option>)}
    </select>
  </div>)
}

function DateEntry({entry,entryName,setEntry}){
  return (
    <div className="entry">
      <span className="field">{entryName}:</span>
      <input
        type="date"
        className="value"
        value={entry}
        onChange={(e) => {setEntry(e.target.value);}}
      />
    </div>
  );
}


function BasicEntry({entry, entryName, setEntry }) {
  return (
    <div className="entry">
      <span className="field">{entryName}:</span>
      <input
        type="text"
        className="value"
        value={entry}
        onChange={(e) => {setEntry(e.target.value);}}
      />
    </div>
  );
}

function EntryWithUnits({  entry,  entryName,  setEntry, units }) {

  const [rawField, setRawField] = React.useState(entry)
  const [unit, setUnit] = React.useState(units.default)

  React.useEffect(() => {
    setEntry(rawField / units[unit].scale);
  }, [rawField]);

  const changeValue = (value) => {
    setRawField(value);
  };

  const changeUnits = (newUnit) => {
    setUnit(newUnit);
  };

  return (
    <div className="entry">
      <span className="field">{entryName}:</span>
      <input
        type="number"
        className="value"
        value={rawField}
        onChange={(e) => changeValue(parseFloat(e.target.value))}
      />
      <select value={unit} onChange={(e) => changeUnits(e.target.value)}>
        {Object.keys(units).map((unitKey) => (
          <option key={unitKey} value={unitKey}>
            {units[unitKey].name}
          </option>
        ))}
      </select>
    </div>
  );
}


function EditableField({ componentWhenNotEditable, componentWhenEditable }) {
  const [editable, setEditable] = React.useState(false);

  const handleToggleEdit = () => {
    setEditable(!editable);
  };

  return (
    <div className="EditableField">
      <div className="EditableFieldValue">
      {editable ? (
        <>
          {componentWhenEditable}
        </>
      ) : (
        <>
          {componentWhenNotEditable}
        </>
      )}
      </div>
      <div className="EditableFieldButton">
      <button onClick={handleToggleEdit}>
        Editar
      </button>
      </div>
    </div>
  );
}





export {DateEntry, DeletableField, EntryWithOptions, BasicEntry, BasicField, FieldWithUnits, EditableField, EntryWithUnits };

