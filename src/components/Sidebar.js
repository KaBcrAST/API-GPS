import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import './Sidebar.css';

const Sidebar = ({
  startAddress,
  setStartAddress,
  endAddress,
  setEndAddress,
  handleRouteRequest,
  franceBounds,
  startSearchBoxRef,
  endSearchBoxRef,
}) => {
  const handlePlacesChanged = (ref, setAddress) => {
    const places = ref.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="search-container">
        <StandaloneSearchBox
          onLoad={(ref) => (startSearchBoxRef.current = ref)}
          onPlacesChanged={() => handlePlacesChanged(startSearchBoxRef, setStartAddress)}
          bounds={franceBounds}
        >
          <input
            type="text"
            placeholder="Adresse de départ"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
            className="search-input"
          />
        </StandaloneSearchBox>
        <StandaloneSearchBox
          onLoad={(ref) => (endSearchBoxRef.current = ref)}
          onPlacesChanged={() => handlePlacesChanged(endSearchBoxRef, setEndAddress)}
          bounds={franceBounds}
        >
          <input
            type="text"
            placeholder="Adresse d'arrivée"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            className="search-input"
          />
        </StandaloneSearchBox>
        <button onClick={handleRouteRequest} className="search-button">Obtenir les itinéraires</button>
      </div>
    </div>
  );
};

export default Sidebar;