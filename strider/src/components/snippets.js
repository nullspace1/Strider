import React from 'react';

export const DistanceUnits = {
  default: 'meter',
  meter: {
    name: 'm',
    scale: 1,
  },
  kilometer: {
    name: 'km',
    scale: 1000,
  },
  mile: {
    name: 'ml',
    scale: 1609.34,
  },
};

export const WeightUnits = {
  kilogram: {
    name: 'kg',
    scale: 1,
  },
  pound: {
    name: 'pd',
    scale: 0.453592,
  },
  gram: {
    name: 'g',
    scale: 0.001,
  },
};


function BasicField({ field, fieldName }) {
  return (
    <div className="entry"><span className="field">{fieldName}:</span> <span className="value">{field}</span></div>
  )
}


function FieldWithUnits({ field, fieldName, units }) {
  const defaultUnit = 'meter'; // Set the default unit to meter
  const [selectedUnit, setSelectedUnit] = React.useState(defaultUnit);

  const handleChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const scale = units[selectedUnit].scale;
  const convertedValue = field * scale;

  return (
    <div className="entry">
      <span className="field">{fieldName}:</span>
      <span className="value">
        {convertedValue} {units[defaultUnit].name}
      </span>
      <select value={selectedUnit} onChange={handleChange}>
        {Object.keys(units).map((unitKey) => (
          <option key={unitKey} value={unitKey}>
            {units[unitKey].name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EntryWithOptions({ entry, entryName, options, setField }) {
  return (<div className="entry">
    <span className="field">{entryName}:</span>
    <select value={entry} onChange={(e) => setField(e.target.value)}>
      {options.map((o,index) => <option key={index} value={o}>{o}</option>)}
    </select>
  </div>)
}


function BasicEntry({ entry, entryName, setField }) {
  return (
    <div className="entry">
      <span className="field">{entryName}:</span>
      <input
        type="text"
        className="value"
        value={entry}
        onChange={(e) => setField(e.target.value)}
      />
    </div>
  );
}

function EntryWithUnits({ field, fieldName, setField, units }) {

  const [rawField, setRawField] = React.useState(0)
  const [unitScale, setUnitScale] = React.useState(units[units.default].scale)

  const setValue = (value) => {
  
      setRawField(value);
      setField(rawField * unitScale)
    
  }

  return (
    <div className="entry">
      <span className="field">{fieldName}:</span>
      <input
        type="number"
        className="value"
        value={rawField}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
      <select onChange={(e) => setField(parseFloat(e.target.value))}>
        {Object.keys(units).map((unitKey) => (
          <option key={unitKey} value={units[unitKey].scale}>
            {units[unitKey].name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EditableField({ componentWhenNotEditable, componentWhenEditable }) {

  const [editable, setEditable] = React.useEffect(false)

  return (
    (editable ? componentWhenEditable : componentWhenNotEditable)
  )
}




export { EntryWithOptions,BasicEntry, BasicField, FieldWithUnits, EditableField, EntryWithUnits };

