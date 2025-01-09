import React from 'react';
import { GoogleMap, Polyline, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';

const MapContainer = ({ directionsResponse, selectedRouteIndex, handleSelectRoute, showTraffic, mapRef, franceBounds }) => {
  return (
    <GoogleMap
      mapContainerStyle={{ height: '100%', width: '100%' }}
      center={{ lat: 46.603354, lng: 1.888334 }}
      zoom={6}
      options={{ streetViewControl: false, mapTypeControl: false, restriction: { latLngBounds: franceBounds, strictBounds: true } }}
      onLoad={map => (mapRef.current = map)}
    >
      {showTraffic && <TrafficLayer />}
      {directionsResponse && directionsResponse.routes.map((route, index) => (
        <Polyline
          key={index}
          path={route.overview_path}
          options={{
            strokeColor: index === selectedRouteIndex ? '#FF0000' : '#808080',
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
          onClick={() => handleSelectRoute(index)}
        />
      ))}
      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
            routeIndex: selectedRouteIndex,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapContainer;