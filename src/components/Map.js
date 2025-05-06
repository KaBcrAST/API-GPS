import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import Sidebar from './Sidebar';
import SidebarMenu from './SidebarMenu';
import './Map.css'; // Assurez-vous de créer ce fichier CSS pour la mise en page

const libraries = ['places'];

const franceBounds = {
  north: 51.1241999,
  south: 41.3253001,
  west: -5.5591,
  east: 9.6624999,
};

const darkModeStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

const Map = ({ name }) => {
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
  const directionsRendererRef = useRef(null);

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

    clearRoute(); // Clear previous route before making a new request

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

  const clearRoute = () => {
    setDirectionsResponse(null);
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
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
    <div className="map-container relative h-screen w-full">
      <SidebarMenu />
      <Sidebar
        startAddress={startAddress}
        setStartAddress={setStartAddress}
        endAddress={endAddress}
        setEndAddress={setEndAddress}
        handleRouteRequest={handleRouteRequest}
        clearRoute={clearRoute}
        startSearchBoxRef={startSearchBoxRef}
        endSearchBoxRef={endSearchBoxRef}
        franceBounds={franceBounds}
        directionsResponse={directionsResponse}
        selectedRouteIndex={selectedRouteIndex}
        handleSelectRoute={handleSelectRoute}
        tollInfo={tollCounts.map((count, index) => ({
          tollCount: count,
        }))}
        hasRadars={() => false} // Remplacez par la logique réelle si disponible
        selectedInfo={{
          distance: true,
          duration: true,
          tolls: true,
        }}
      />
     
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={{ lat: 48.8566, lng: 2.3522 }} // Centrer la carte sur Paris
        zoom={10}
        options={{
          styles: darkModeStyle,
          mapTypeControl: false, // Désactiver le contrôle de type de carte (plan/satellite)
          fullscreenControl: false, // Désactiver le contrôle de plein écran
          streetViewControl: false, // Désactiver le contrôle de Street View
          zoomControl: false, // Désactiver les boutons de zoom (+ et -)
        }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              directions: directionsResponse,
              routeIndex: selectedRouteIndex,
              polylineOptions: {
                strokeColor: '#4A3AFF', // Couleur de la ligne des trajets
                strokeOpacity: 1.0,
                strokeWeight: 4,
              },
            }}
            onLoad={(directionsRenderer) => (directionsRendererRef.current = directionsRenderer)}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;