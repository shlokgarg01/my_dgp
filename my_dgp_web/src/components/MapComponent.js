import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Colors from "../utils/Colors";
import BikeIcon from "../images/Bike.png";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { MAP_API_KEY } from "../config/Config";
import axios from "axios";

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
  increaseMapHeight,
  subService
}) => {
  const [position, setPosition] = useState(initialLocation);
  const [bikeLocations, setBikeLocations] = useState([]);
  const [showMarker, setShowMarker] = useState(true);
  const [isCurrentLocation, setCurrentLocation] = useState(true);
  // const markerRef = useRef(null);
  const mapRef = useRef(null);

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

  let updateCoordinatesAndBikeCoordinates = (coordinates) => {
    let bikeCordinates = generateRandomCoordinates(coordinates);
    setBikeLocations(bikeCordinates);
    handleLocationChange(coordinates);
  };

  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
  };

  // const eventHandlers = useMemo(
  //   () => ({
  //     dragend() {
  //       const marker = markerRef.current;
  //       if (marker != null) {
  //         setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
  //         let coordinates = [marker.getLatLng().lat, marker.getLatLng().lng];
  //         updateCoordinatesAndBikeCoordinates(coordinates);
  //       }
  //     },
  //   }),
  //   // eslint-disable-next-line
  //   []
  // );
  // ...

  useEffect(() => {
    let coordinates = generateRandomCoordinates(initialLocation);
    setBikeLocations(coordinates);
    setPosition(initialLocation);
  }, [initialLocation]);

  const bikeIcon = L.icon({
    iconUrl: BikeIcon,
    iconSize: [40, 40],
    iconAnchor: [16, 32],
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (mapRef.current && !mapRef.current.contains(event.target)) {
      //   // Handle the click outside map logic here
      //   increaseMapHeight(false);
      //   if (subService !== undefined && subService !== "") setShowMarker(false);
      // }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, subService]);

  const updateAddress = async (place) => {
    let add = place.label;
    let results = await geocodeByAddress(add);
    add = results[0].formatted_address;
    onSearchChange(add);
    geocodeByAddress(add)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setPosition([lat, lng]);
        updateCoordinatesAndBikeCoordinates([lat, lng]);
      });
  };

  const fetchAddress = async (lat, long) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: lat,
          lon: long,
          format: 'json',
        },
      });
      onSearchChange(response.data.display_name);
    } catch (error) {
      console.log("reverse geo code failed: ", error);
      // setError('Failed to fetch address');
    }
  };

  function MapCenter() {
    useMapEvents({
      dragend: () => {
        fetchAddress(position[0], position[1])
        setCurrentLocation(true)
      },
      drag: (e) => {
        setPosition([e.target.getCenter().lat, e.target.getCenter().lng]);
      },
      click: (e) => {
        // increaseMapHeight(true);
        // setShowMarker(true)
      },
    });
    return null;
  }

  return (
    <>
      {isEditable && (
        <div
          style={{
            top: 10,
            position: "absolute",
            left: "11.5%",
            borderRadius: 100,
            zIndex: 1000,
            width: "85%",
            boxShadow: `0px 2px 4px ${Colors.LIGHT_GRAY}`,
            pointerEvents: "auto",
          }}
        >
          {isCurrentLocation ?
            <input
              style={{ accentColor: Colors.PRIMARY, width: '100%', borderWidth: 0.6, borderColor: Colors.MEDIUM_GRAY, padding: 5 }}
              value={searchValue}
              onTouchStart={() => { setCurrentLocation(false) }}
            />
            : <GooglePlacesAutocomplete
              zIndex={100}
              apiKey={MAP_API_KEY}
              onMouseDown={updateAddress}
              apiOptions={{ region: "in" }}
              selectProps={{
                onChange: updateAddress,
                placeholder: "Search your address",
              }}
              inputProps={{
                style: { pointerEvents: "auto" },
              }}
            />}
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <MapContainer
          style={{
            height: "100%",
            width: "100%",
            marginTop: -80
          }}
          zoomControl={false} // hides the + - button for zoom
          center={initialLocation}
          zoom={16} // increases the default zoom level of the map
        // maxZoom={20} // on enabling it, it causes the map to become on zooming much. So, disabled it.
        >
          <MapCenter />
          <TileLayer
            attribution="Google Maps"
            url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          />

          {/* Hides marker when the map is reduced in size */}
          {showMarker && (
            <Marker
              draggable={false}
              // eventHandlers={eventHandlers}
              position={position}
            // ref={markerRef}
            />
          )}
          {/* To recenter the map whenever the coordinate changes */}
          <RecenterAutomatically lat={position[0]} lng={position[1]} />
          {isEditable &&
            bikeLocations.map((bike, index) => (
              <Marker key={index} position={bike} icon={bikeIcon} />
            ))}
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;
