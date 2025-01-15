import React from 'react';
import RouteList from './RouteList';
import './Results.css';

const Results = ({ directionsResponse, selectedRouteIndex, handleSelectRoute, tollInfo, hasRadars, selectedInfo }) => {
  return (
    <div className="results-container">
      {directionsResponse && directionsResponse.routes.length > 0 ? (
        <RouteList
          directionsResponse={directionsResponse}
          selectedRouteIndex={selectedRouteIndex}
          handleSelectRoute={handleSelectRoute}
          tollInfo={tollInfo}
          hasRadars={hasRadars}
          selectedInfo={selectedInfo}
        />
      ) : (
        <p>Aucun itinéraire trouvé.</p>
      )}
    </div>
  );
};

export default Results;