import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import Colors from "../utils/Colors";
import BikeIcon from "../images/Bike.png";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { MAP_API_KEY } from "../config/Config";
// import , {geocodeByAddress } from 'react-google-places-autocomplete';

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
  isEditable,
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
  };

  let updateCorodinatesAndBikeCoordinates = (coordinates) => {
    let bikeCordinates = generateRandomCoordinates(coordinates);
    setBikeLocations(bikeCordinates);
    handleLocationChange(coordinates);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          let coordinates = [marker.getLatLng().lat, marker.getLatLng().lng];
          updateCorodinatesAndBikeCoordinates(coordinates);
        }
      },
    }),
    []
  );

  useEffect(() => {
    let cordinates = generateRandomCoordinates(initialLocation);
    setBikeLocations(cordinates);
  }, []);

  const bikeIcon = L.icon({
    iconUrl: BikeIcon,
    iconSize: [40, 40],
    iconAnchor: [16, 32],
  });

  const updateAddress = async (place) => {
    let add = place.label;
    let results = await geocodeByAddress(add);
    add = results[0].formatted_address;

    onSearchChange(add);
    geocodeByAddress(add)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setPosition([lat, lng]);
        updateCorodinatesAndBikeCoordinates([lat, lng]);
      });
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
        draggable={isEditable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />

      {isEditable &&
        bikeLocations.map((bike, index) => (
          <Marker key={index} position={bike} icon={bikeIcon} />
        ))}

      {isEditable && (
        <div
          style={{
            top: 10,
            position: "absolute",
            left: "15%",
            borderRadius: 100,
            zIndex: 1000,
            width: "75%",
            boxShadow: `0px 2px 4px ${Colors.LIGHT_GRAY}`,
          }}
        >
          <GooglePlacesAutocomplete
            apiKey={MAP_API_KEY}
            apiOptions={{ region: "in" }}
            selectProps={{
              onChange: updateAddress,
              // value: searchValue,
            }}
          />
        </div>
      )}
    </MapContainer>
  );
};

export default MapComponent;
