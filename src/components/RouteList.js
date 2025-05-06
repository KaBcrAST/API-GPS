import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://react-gpsapi.vercel.app';

const RouteList = ({ directionsResponse, selectedRouteIndex, handleSelectRoute, tollInfo = [], hasRadars, selectedInfo }) => {
  const [qrCodeDataURL, setQRCodeDataURL] = useState(null);

  const handleGenerateQRCode = async (route) => {
    if (!route || !route.legs || !route.legs[0]) return;

    // Création d'un deep link pour l'app mobile
    const deepLink = `gpsapp://navigation?` + 
      `origin=${encodeURIComponent(route.legs[0].start_address)}` +
      `&destination=${encodeURIComponent(route.legs[0].end_address)}` +
      `&mode=driving`;

    try {
      const response = await axios.post(`${API_URL}/api/generate-qrcode`, { 
        url: deepLink 
      });

      if (response.data && response.data.qrCodeDataURL) {
        setQRCodeDataURL(response.data.qrCodeDataURL);
      } else {
        console.error('Invalid QR code response:', response.data);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (!directionsResponse || !directionsResponse.routes || directionsResponse.routes.length === 0) {
    return <div>Aucun itinéraire disponible.</div>; // Gestion de l'absence d'itinéraires
  }

  return (
    <div className="routes-container">
      <h3>Itinéraires disponibles</h3>
      {directionsResponse.routes.map((route, index) => {
        const leg = route.legs[0]; // Vérifiez que `legs[0]` existe

        // Vérification de travelMode
        const travelMode = leg ? leg.mode : 'Non défini'; // Valeur par défaut si `mode` est manquant
        console.log(`Mode de transport pour l'itinéraire ${index + 1}: ${travelMode}`);

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
                Durée: {leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration?.text || 'Non disponible'}
              </p>
            )}
            {selectedInfo.tolls && tollInfo[index] && tollInfo[index].tollCount !== undefined && (
              <p style={{ color: tollInfo[index].tollCount > 0 ? 'red' : 'green' }}>
                {tollInfo[index].tollCount > 0
                  ? `Cet itinéraire comporte ${tollInfo[index].tollCount} péage(s)`
                  : 'Sans péages'}
              </p>
            )}
            {hasRadars && hasRadars(route) && <p style={{ color: 'blue' }}>Cet itinéraire comporte des radars</p>}
            <button onClick={() => handleGenerateQRCode(route)}>Générer QR Code</button>
          </div>
        );
      })}
      {qrCodeDataURL && (
        <div>
          <h4>QR Code pour l'itinéraire sélectionné :</h4>
          <img src={qrCodeDataURL} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default RouteList;