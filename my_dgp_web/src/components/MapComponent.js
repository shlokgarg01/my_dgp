import React, { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("../images/marker.png"),
  iconUrl: require("../images/marker.png"),
  iconSize: new L.Point(40, 40),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
});

const MapComponent = ({ handleLocationChange, initialLocation }) => {
  const [position, setPosition] = useState(initialLocation);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          handleLocationChange([
            marker.getLatLng().lat,
            marker.getLatLng().lng,
          ]);
        }
      },
    }),
    []
  );

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    handleLocationChange({ lat, lng });
  };

  return (
    <MapContainer
      style={{
        height: "100vh",
        width: "100%",
      }}
      center={initialLocation}
      zoom={10}
      maxZoom={20}
    >
      <TileLayer
        attribution="Google Maps"
        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    </MapContainer>
  );
};

export default MapComponent;
