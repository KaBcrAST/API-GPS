import React from 'react';

const RouteList = ({ directionsResponse, selectedRouteIndex, handleSelectRoute, tollInfo, hasRadars, selectedInfo }) => {
  if (!directionsResponse || !directionsResponse.routes) {
    return null; // Assurez-vous que directionsResponse et routes existent
  }

  return (
    <div className="routes-container">
      <h3>Itinéraires disponibles</h3>
      {directionsResponse.routes.map((route, index) => {
        const leg = route.legs[0]; // Assurez-vous que `legs[0]` existe
        return (
          <div
            key={index}
            className={`route-option ${index === selectedRouteIndex ? 'selected' : ''}`}
            onClick={() => handleSelectRoute(index)}
          >
            <h4>Itinéraire {index + 1}</h4>
            {leg && selectedInfo.distance && <p>Distance: {leg.distance?.text || 'Non disponible'}</p>}
            {leg && selectedInfo.duration && (
              <p>
                Durée: {leg.duration_in_traffic
                  ? leg.duration_in_traffic.text
                  : leg.duration?.text || 'Non disponible'}
              </p>
            )}
            {selectedInfo.tolls && tollInfo[index]?.tollCount !== undefined && (
              <p style={{ color: tollInfo[index].tollCount > 0 ? 'red' : 'green' }}>
                {tollInfo[index].tollCount > 0
                  ? `Cet itinéraire comporte ${tollInfo[index].tollCount} péage(s) avec un coût total de ${tollInfo[index].tollCost || 0} unités`
                  : 'Sans péages'}
              </p>
            )}
            {hasRadars && hasRadars(route) && <p style={{ color: 'blue' }}>Cet itinéraire comporte des radars</p>}
          </div>
        );
      })}
    </div>
  );
};

export default RouteList;