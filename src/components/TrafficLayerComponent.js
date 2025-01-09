import React, { useEffect } from 'react';

const TrafficLayerComponent = ({ map, showTraffic }) => {
  useEffect(() => {
    let trafficLayer = null;

    if (map) {
      if (showTraffic) {
        // Créez un nouvel objet TrafficLayer si 'showTraffic' est vrai
        trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(map); // Attachez-le à la carte
      } else {
        // Si 'showTraffic' est faux, supprimez le TrafficLayer de la carte
        if (trafficLayer) {
          trafficLayer.setMap(null);
        }
      }
    }

    // Nettoyage lorsque le composant est démonté ou que 'showTraffic' change
    return () => {
      if (trafficLayer) {
        trafficLayer.setMap(null);
      }
    };
  }, [map, showTraffic]);

  return null;
};

export default TrafficLayerComponent;
