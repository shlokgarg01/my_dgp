import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GiStopwatch } from "react-icons/gi";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllServices } from "../actions/ServiceActions";
import Loader from "./Loader";
import { createSearchParams, useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import Btn from "./components/Btn";
import InputGroup from "./components/InputGroup";
import "../styles/ComponentStyles.css";

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); // set initial date as today's date
  const [selectedTime, setselectedTime] = useState(1);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });
  let TAX = 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, error, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(getAllServices());

    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    setSelectedService(services[0]?._id);
    setServiceName(services[0]?.name);
  }, [services]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const Packages = () => (
    <div>
      {services.map((service, index) => (
        <div
          key={index}
          onClick={() => {
            setSelectedService(service._id);
            setServiceName(service.name);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 13,
            fontSize: 16,
            borderRadius: 7,
            boxShadow:
              selectedService === service._id
                ? `1px 1px 4px ${Colors.GRAY}`
                : null,
            border:
              selectedService === service._id
                ? `1px solid ${Colors.GRAY}`
                : null,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{service.name}</div>{" "}
          <div style={{ fontWeight: 700 }}>₹ {service.charges}/hr</div>
        </div>
      ))}
    </div>
  );

  const TimeSlider = ({ time }) => (
    <div
      onClick={() => setselectedTime(time)}
      style={{
        backgroundColor: Colors.WHITE,
        margin: 10,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        fontWeight: "bold",
        fontSize: 17,
        boxShadow:
          selectedTime === time ? "0 0 0" : `1px 1px 4px ${Colors.GRAY}`,
        border: selectedTime === time ? `1px solid ${Colors.DARK_GRAY}` : null,
        borderRadius: 4,
      }}
    >
      {time} hr
      <br />
      <div style={{ fontSize: 12, color: Colors.GRAY }}>
        ₹{" "}
        {time *
          services.find((service) => service._id === selectedService)?.charges}
      </div>
    </div>
  );

  const getItemPrice = () => {
    let charges = services.find((x) => x._id === selectedService).charges;
    return charges * selectedTime + TAX;
  };

  const submit = () => {
    if (!address) {
      alert("Please enter valid address");
      return;
    } else if (!selectedService) {
      alert("Plese select a service");
      return;
    }

    navigate({
      pathname: "/details",
      search: createSearchParams({
        service: selectedService,
        serviceName,
        date,
        hours: selectedTime.value,
        address,
        taxPrice: TAX,
        itemsPrice: getItemPrice(),
        totalPrice: getItemPrice(),
      }).toString(),
    });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ backgroundColor: Colors.WHITE }}>
          <div
            style={{
              height: "310px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "94%",
                marginBottom: 16,
              }}
            >
              <InputGroup
                placeholder="Search"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                icon={<FaSearch color={Colors.GRAY} />}
                bgColor={Colors.LIGHT_GRAY}
              />
            </div>
            <MapComponent
              style={{ height: 200, width: 200 }}
              handleLocationChange={handleLocationChange}
              initialLocation={location}
            />
          </div>

          {/* Banner */}
          <div
            style={{
              textAlign: "center",
              backgroundColor: Colors.PRIMARY,
              color: Colors.WHITE,
              paddingTop: 7,
              paddingBottom: 7,
              fontSize: 14,
            }}
          >
            Booking photographers & videographers made easy
          </div>

          <div
            style={{
              backgroundColor: Colors.LIGHT_GRAY,
              height: 1,
              marginTop: 28,
            }}
          />

          {/* Date Selection */}
          <div
            style={{
              width: "40%",
              padding: "0 4px",
              borderRadius: 7,
              boxShadow: `1px 1px 4px ${Colors.GRAY}`,
              marginTop: -31,
              marginLeft: "55%",
            }}
          >
            <InputGroup
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
            />
          </div>

          {/* Duration Selection */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              <GiStopwatch color={Colors.BLACK} size={25} />
              <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                Duration
              </font>
            </div>

            <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {Array.from({ length: 7 }, (_, index) => index + 1).map(
                (item) => (
                  <TimeSlider time={item} />
                )
              )}
            </div>
          </div>

          {/* Package Prices */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              {/* <GiStopwatch color={Colors.BLACK} size={25} /> */}
              <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                Select Package
              </font>
            </div>

            <div>
              <Packages />
            </div>
          </div>

          {/* Next Button */}
          <Btn title="Next" onClick={submit} />
        </div>
      )}
    </div>
  );
}

const styles = {
  serviceSliderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 7,
    paddingBottom: 7,
  },
  serviceSliderImageContainer: {
    textAlign: "center",
    width: "50%", // TODO - make it 33.33 for 3 services
    cursor: "pointer",
    marginBottom: 7,
  },
  serviceSliderImage: { height: 40, width: 58 },
  packagePricesContainer: {
    marginLeft: "2.5%",
    width: "95%",
    padding: 10,
    borderRadius: 7,
  },
  dateTimeContainer: {
    marginLeft: "5%",
    width: "90%",
    boxShadow: `1px 1px 10px ${Colors.GRAY}`,
    padding: 10,
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 10,
  },
  packagePriceSubContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },
  priceContainer: {
    backgroundColor: Colors.PRIMARY,
    width: "90%",
    marginLeft: "10%",
    marginTop: 10,
    borderRadius: 7,
    boxShadow: `1px 1px 4px ${Colors.GRAY}`,
    color: Colors.WHITE,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 22,
    paddingRight: 16,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
