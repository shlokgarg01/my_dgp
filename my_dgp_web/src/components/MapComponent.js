import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import InputGroup from "./components/InputGroup";
import { FaSearch } from "react-icons/fa";
import Colors from "../utils/Colors";
import BikeIcon from "../images/Bike.png";

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

const MapComponent = ({
  handleLocationChange,
  initialLocation,
  onSearchChange,
  searchValue,
}) => {
  const [position, setPosition] = useState(initialLocation);
  const [bikeLocations, setBikeLocations] = useState([]);
  const markerRef = useRef(null);

  const generateRandomCoordinates = (newLocation) => {
    const earthRadiusKm = 6371;

    function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    function toDegrees(radians) {
      return radians * (180 / Math.PI);
    }

    const randomCoordinates = [];
    while (randomCoordinates.length < 4) {
      // Generate random bearing (angle) between 0 and 360 degrees
      const randomBearing = Math.random() * 360;
      // Generate random distance between 0 and 10Km
      const randomDistance = Math.random() * 10;

      // Calculate new latitude and longitude based on the given coordinates, random distance, and bearing
      const lat1 = toRadians(newLocation[0]);
      const lon1 = toRadians(newLocation[1]);
      const angularDistance = randomDistance / earthRadiusKm;
      const bearing = toRadians(randomBearing);

      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance) +
          Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
      );
      const lon2 =
        lon1 +
        Math.atan2(
          Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
          Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
        );
      // Convert latitude and longitude from radians to degrees
      const newLatitude = toDegrees(lat2);
      const newLongitude = toDegrees(lon2);
      randomCoordinates.push({ lat: newLatitude, lng: newLongitude });
    }
    return randomCoordinates;
  }

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          let coordinates = [marker.getLatLng().lat, marker.getLatLng().lng];
          let bikeCordinates = generateRandomCoordinates(coordinates);
          setBikeLocations(bikeCordinates);
          handleLocationChange(coordinates);
        }
      },
    }),
    []
  );

  useEffect(() => {
    let cordinates = generateRandomCoordinates(initialLocation)
    setBikeLocations(cordinates)
  }, [])

  const bikeIcon = L.icon({
    iconUrl: BikeIcon,
    iconSize: [40, 40],
    iconAnchor: [16, 32],
  });

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

      {bikeLocations.map((bike, index) => (
        <Marker key={index} position={bike} icon={bikeIcon} />
      ))}

      <div
        style={{
          position: "absolute",
          left: "15%",
          borderRadius: 100,
          zIndex: 1000,
          width: "75%",
          boxShadow: `0px 2px 4px ${Colors.LIGHT_GRAY}`,
        }}
      >
        <InputGroup
          placeholder="Search"
          onChange={onSearchChange}
          value={searchValue}
          type="text"
          icon={<FaSearch color={Colors.GRAY} />}
          bgColor={Colors.WHITE}
          roundedBorder={true}
        />
      </div>
    </MapContainer>
  );
};

export default MapComponent;
