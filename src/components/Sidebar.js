import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import RouteList from './RouteList';
import './Sidebar.css';

const Sidebar = ({
  startAddress,
  setStartAddress,
  endAddress,
  setEndAddress,
  handleRouteRequest,
  franceBounds,
  directionsResponse,
  selectedRouteIndex,
  handleSelectRoute,
  tollInfo,
  hasRadars,
  selectedInfo,
}) => {
  const startSearchBoxRef = useRef(null);
  const endSearchBoxRef = useRef(null);

  const handlePlacesChanged = (ref, setAddress) => {
    const places = ref.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address);
    }
  };

  return (
    <div className="sidebar-container fixed top-0 left-0 w-72 h-full bg-gray-900 shadow-lg z-1000 p-5 rounded-r-lg text-white flex flex-col">
      <div className="search-container bg-gray-900 z-1001 pb-2">
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
            className="search-input w-full p-2 mb-2 bg-gray-700 text-white border-none rounded"
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
            className="search-input w-full p-2 mb-2 bg-gray-700 text-white border-none rounded"
          />
        </StandaloneSearchBox>
        <button onClick={handleRouteRequest} className="search-button w-full p-2 bg-blue-500 text-white rounded">Obtenir les itinéraires</button>
      </div>
      {directionsResponse && directionsResponse.routes.length > 0 && (
        <div className="routes-container mt-4 overflow-y-auto flex-grow w-full">
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