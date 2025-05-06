import React, { useState, useEffect, useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import './Sidebar.css';
import RouteList from './RouteList'; // Importer le composant RouteList

const Sidebar = ({
  startAddress,
  setStartAddress,
  endAddress,
  setEndAddress,
  handleRouteRequest,
  clearRoute,
  franceBounds,
  startSearchBoxRef,
  endSearchBoxRef,
  directionsResponse,
  selectedRouteIndex,
  handleSelectRoute,
  tollInfo,
  hasRadars,
  selectedInfo
}) => {
  const [debouncedStartAddress, setDebouncedStartAddress] = useState(startAddress);
  const [debouncedEndAddress, setDebouncedEndAddress] = useState(endAddress);
  const [addressesChanged, setAddressesChanged] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (startAddress !== debouncedStartAddress || endAddress !== debouncedEndAddress) {
        setDebouncedStartAddress(startAddress);
        setDebouncedEndAddress(endAddress);
        setAddressesChanged(true);
      }
    }, 500); // Délai de 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [startAddress, endAddress, debouncedStartAddress, debouncedEndAddress]);

  useEffect(() => {
    if (addressesChanged) {
      clearRoute();
      setAddressesChanged(false);
    }
  }, [addressesChanged, clearRoute]);

  const handlePlacesChanged = (ref, setAddress) => {
    const places = ref.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="search-container">
        <div className="input-group">
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
              className="search-input pac-target-input"
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
              className="search-input pac-target-input"
            />
          </StandaloneSearchBox>
          <button onClick={handleRouteRequest} className="search-button">Obtenir les itinéraires</button>
        </div>
      </div>
      {directionsResponse && directionsResponse.routes && directionsResponse.routes.length > 0 && (
        <div className="route-list-container">
          <RouteList
            directionsResponse={directionsResponse}
            selectedRouteIndex={selectedRouteIndex}
            handleSelectRoute={handleSelectRoute}
            tollInfo={tollInfo}
            hasRadars={hasRadars}
            selectedInfo={selectedInfo}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;