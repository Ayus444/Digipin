import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function LocationMarker({ setCoordinates }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    },
  });
  return null;
}

function App() {
  const [coordinates, setCoordinates] = useState({ latitude: '', longitude: '' });
  const [digipin, setDigipin] = useState('');

  const fetchDigiPin = async () => {
    const { latitude, longitude } = coordinates;
    if (!latitude || !longitude) return alert("Please enter both latitude and longitude");

    try {
      const res = await fetch(`http://localhost:5000/api/digipin/encode?latitude=${latitude}&longitude=${longitude}`);
      const data = await res.json();
      if (data.digipin) {
        setDigipin(data.digipin);
      } else {
        setDigipin("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setDigipin("API call failed");
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🌍 DigiPin Generator</h1>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <input
          type="number"
          placeholder="Latitude"
          value={coordinates.latitude}
          onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '45%' }}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={coordinates.longitude}
          onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '45%' }}
        />
        <button
          onClick={fetchDigiPin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Generate DigiPin
        </button>
      </div>

      {digipin && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f0f8ff',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '18px',
          marginBottom: '15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          📍 <strong>DigiPin:</strong> {digipin}
        </div>
      )}

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '450px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setCoordinates={setCoordinates} />
      </MapContainer>

      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#555' }}>
        👆 Click anywhere on the map to auto-fill latitude and longitude
      </p>
    </div>
  );
}

export default App;
// import React, { useState } from 'react';
// import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';