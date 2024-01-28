import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapComponent = ({ handleLocationChange, initialLocation }) => {
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    handleLocationChange({ lat, lng });
  };

  return (
    <MapContainer
      center={initialLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      onClick={handleMapClick}
    >
      <TileLayer
        attribution="Google Maps"
        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
      />
      {/* Marker for the initial location */}
      <Marker position={initialLocation}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
