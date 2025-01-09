import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import Sidebar from './Sidebar';
import MapContainer from './MapContainer';
import SidebarMenu from './SidebarMenu';
import './Map.css'; // Assurez-vous de créer ce fichier CSS pour la mise en page

const libraries = ['places'];

const franceBounds = {
  north: 51.1241999,
  south: 41.3253001,
  west: -5.5591,
  east: 9.6624999,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly',
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showTraffic, setShowTraffic] = useState(false);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [tollCounts, setTollCounts] = useState([]);
  const startSearchBoxRef = useRef(null);
  const endSearchBoxRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && showTraffic) {
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(mapRef.current);
    }
  }, [showTraffic]);

  const handleRouteRequest = () => {
    if (!startAddress || !endAddress) {
      alert('Les adresses de départ et d\'arrivée doivent être fournies.');
      return;
    }

    const directionsRequest = {
      origin: startAddress,
      destination: endAddress,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true,
      drivingOptions: {
        departureTime: new Date(), // Pour obtenir les informations de trafic en temps réel
        trafficModel: 'bestguess', // Utiliser les données de trafic en temps réel
      },
      region: 'FR', // Limiter les résultats à la France
      avoidTolls,
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(directionsRequest, (response, status) => {
      if (status === 'OK') {
        setDirectionsResponse(response);
        countTolls(response.routes);
      } else {
        console.error('Erreur lors de la récupération des directions:', status);
      }
    });
  };

  const countTolls = (routes) => {
    const tollData = routes.map(route => {
      let tollCount = 0;
      route.legs.forEach(leg => {
        leg.steps.forEach(step => {
          if (step.instructions.toLowerCase().includes('péage') || step.instructions.toLowerCase().includes('toll')) {
            tollCount++;
          }
        });
      });
      return tollCount;
    });
    setTollCounts(tollData);
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
  };

  const handlePlacesChanged = (ref, setAddress) => {
    const places = ref.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address);
    }
  };

  if (loadError) return <div>Erreur de chargement des cartes: {loadError.message}</div>;
  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div className="map-container">
      <SidebarMenu />
      <Sidebar
        startAddress={startAddress}
        setStartAddress={setStartAddress}
        endAddress={endAddress}
        setEndAddress={setEndAddress}
        handleRouteRequest={handleRouteRequest}
        startSearchBoxRef={startSearchBoxRef}
        endSearchBoxRef={endSearchBoxRef}
        franceBounds={franceBounds}
        directionsResponse={directionsResponse}
        selectedRouteIndex={selectedRouteIndex}
        handleSelectRoute={handleSelectRoute}
        tollInfo={tollCounts.map((count, index) => ({
          tollCount: count,
          tollCost: 0, // Remplacez par le coût réel si disponible
        }))}
        hasRadars={() => false} // Remplacez par la logique réelle si disponible
        selectedInfo={{
          distance: true,
          duration: true,
          tolls: true,
        }}
      />
      <MapContainer
        directionsResponse={directionsResponse}
        selectedRouteIndex={selectedRouteIndex}
        handleSelectRoute={handleSelectRoute}
        showTraffic={showTraffic}
        mapRef={mapRef}
        franceBounds={franceBounds}
      />
    </div>
  );
};

export default Map;