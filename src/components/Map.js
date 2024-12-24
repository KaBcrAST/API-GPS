import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];

const RoutingMachine = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
            routeWhileDragging: true,
        }).addTo(map);

        return () => {
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, start, end]);

    return null;
};

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [position, setPosition] = useState([46.603354, 1.888334]); // Coordonnées de la France par défaut
    const [zoom, setZoom] = useState(6); // Niveau de zoom pour la France par défaut
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);

    const startSearchBoxRef = useRef(null);
    const endSearchBoxRef = useRef(null);

    const fetchCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/gps/coordinates`, {
                params: { latitude, longitude }
            });
            const { lat, lon } = response.data;
            setPosition([lat, lon]);
            setUserPosition([lat, lon]);
            setZoom(15); // Ajustez le niveau de zoom ici
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };

    const fetchAddressCoordinates = async (address, setCoordinate) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/gps/coordinates`, {
                params: { address }
            });
            const { latitude, longitude } = response.data;
            setCoordinate([latitude, longitude]);
        } catch (error) {
            console.error('Error fetching address coordinates:', error);
        }
    };

    const handleMapClick = (e) => {
        if (!start) {
            setStart([e.latlng.lat, e.latlng.lng]);
        } else if (!end) {
            setEnd([e.latlng.lat, e.latlng.lng]);
        }
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        fetchAddressCoordinates(startAddress, setStart);
        fetchAddressCoordinates(endAddress, setEnd);
    };

    const handleSuggestionClick = (suggestion, setCoordinate, setAddress, setSuggestions) => {
        const { lat, lng } = suggestion.geometry.location;
        setCoordinate([lat(), lng()]);
        setAddress(suggestion.formatted_address);
        setSuggestions([]);
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handleAddressSubmit}>
                <div>
                    <label>
                        Start Address:
                        <StandaloneSearchBox
                            onLoad={ref => (startSearchBoxRef.current = ref)}
                            onPlacesChanged={() => {
                                const places = startSearchBoxRef.current.getPlaces();
                                setStartSuggestions(places);
                            }}
                        >
                            <input type="text" value={startAddress} onChange={(e) => setStartAddress(e.target.value)} />
                        </StandaloneSearchBox>
                        <ul>
                            {startSuggestions.map((suggestion) => (
                                <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, setStart, setStartAddress, setStartSuggestions)}>
                                    {suggestion.formatted_address}
                                </li>
                            ))}
                        </ul>
                    </label>
                </div>
                <div>
                    <label>
                        End Address:
                        <StandaloneSearchBox
                            onLoad={ref => (endSearchBoxRef.current = ref)}
                            onPlacesChanged={() => {
                                const places = endSearchBoxRef.current.getPlaces();
                                setEndSuggestions(places);
                            }}
                        >
                            <input type="text" value={endAddress} onChange={(e) => setEndAddress(e.target.value)} />
                        </StandaloneSearchBox>
                        <ul>
                            {endSuggestions.map((suggestion) => (
                                <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, setEnd, setEndAddress, setEndSuggestions)}>
                                    {suggestion.formatted_address}
                                </li>
                            ))}
                        </ul>
                    </label>
                </div>
                <button type="submit">Get Route</button>
            </form>
            <MapContainer center={position} zoom={zoom} style={{ height: "100vh", width: "100vw" }} onClick={handleMapClick}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {userPosition && (
                    <Marker position={userPosition}>
                        <Popup>
                            You are here.
                        </Popup>
                    </Marker>
                )}
                {start && (
                    <Marker position={start}>
                        <Popup>
                            Start Point
                        </Popup>
                    </Marker>
                )}
                {end && (
                    <Marker position={end}>
                        <Popup>
                            End Point
                        </Popup>
                    </Marker>
                )}
                {start && end && <RoutingMachine start={start} end={end} />}
            </MapContainer>
        </div>
    );
};

export default Map;