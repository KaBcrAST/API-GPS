import React from 'react';
import './InfoSelection.css';

const InfoSelection = ({ selectedInfo, handleInfoChange, toggleInfoMenu }) => {
  return (
    <div className="info-selection">
      <button className="burger-menu" onClick={toggleInfoMenu}>
        ☰
      </button>
      <div className="info-options">
        <label>
          <input
            type="checkbox"
            checked={selectedInfo.distance}
            onChange={() => handleInfoChange('distance')}
          />
          Distance
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedInfo.duration}
            onChange={() => handleInfoChange('duration')}
          />
          Durée
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedInfo.tolls}
            onChange={() => handleInfoChange('tolls')}
          />
          Nombre de péages
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedInfo.startEndPoints}
            onChange={() => handleInfoChange('startEndPoints')}
          />
          Adresses de départ et d'arrivée
        </label>
      </div>
    </div>
  );
};

export default InfoSelection;