import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { FaSearch } from "react-icons/fa";
import { GiStopwatch } from "react-icons/gi";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllServices } from "../actions/ServiceActions";
import Service from "../utils/Data/Service";
import Loader from "./Loader";
import DatePicker from "react-date-picker";
import { createSearchParams, useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import Select from "react-select";

export default function Home() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [date, setDate] = useState(new Date() + 1);
  const [selectedTime, setselectedTime] = useState({ value: "1", label: "1 hr" });
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });
  let TAX = 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, error, loading } = useSelector((state) => state.services);

  const options = [
    { value: "1", label: "1 hr" },
    { value: "2", label: "2 hr" },
    { value: "3", label: "3 hr" },
    { value: "4", label: "4 hr" },
    { value: "5", label: "5 hr" },
    { value: "6", label: "6 hr" },
    { value: "7", label: "7 hr" },
    { value: "8", label: "8 hr" },
    { value: "9", label: "9 hr" },
    { value: "10", label: "10 hr" },
  ];

  useEffect(() => {
    dispatch(getAllServices());

    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const SliderContent = ({ image, title, index }) => (
    <div
      onClick={() => setSelectedServiceIndex(index)}
      style={styles.serviceSliderImageContainer}
    >
      <img alt="Services" src={image} style={styles.serviceSliderImage} />
      <div
        style={{
          color: selectedServiceIndex === index ? Colors.PRIMARY : Colors.GRAY,
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
      <div
        style={{
          border:
            selectedServiceIndex === index
              ? `1px solid ${Colors.PRIMARY}`
              : null,
          width: "50%",
          marginLeft: "25%",
          borderRadius: 100,
        }}
      />
    </div>
  );

  const PricesContent = ({ title }) => (
    <div
      style={styles.priceContainer}
      onClick={() => {
        let a = services.find(
          (x) => x.name === `${Service[selectedServiceIndex].name} ${title}`
        );

        setSelectedService(a._id);
        setServiceName(a.name);
      }}
    >
      <div>{title}</div>
      {loading === false ? (
        <div>
          ₹{" "}
          {
            services.find(
              (x) => x.name === `${Service[selectedServiceIndex].name} ${title}`
            ).charges
          }
        </div>
      ) : null}
    </div>
  );

  const getItemPrice = () => {
    console.log(selectedTime)
    let charges = services.find((x) => x._id === selectedService).charges;
    return charges * selectedTime.value + TAX;
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
        hours: selectedTime,
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
        <>
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
                marginTop: 16,
                marginBottom: 10,
                width: "85%",
                borderRadius: 4,
                boxShadow: "0px 0px 7px grey",
                paddingLeft: 16,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconContext.Provider value={{ color: Colors.GRAY }}>
                <FaSearch />
              </IconContext.Provider>
              <input
                type="text"
                placeholder="Search"
                style={{ border: 0, paddingLeft: 10, width: "100%" }}
                onChange={(e) => setAddress(e.target.value)}
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

          {/* Services Slider */}
          <div style={styles.serviceSliderContainer}>
            <SliderContent
              image={require("../images/camera.png")}
              title="Photography"
              index={0}
            />
            <SliderContent
              image={require("../images/videogrpahy.png")}
              title="Videography"
              index={1}
            />
            {/* <SliderContent
          image={require("../images/both.png")}
          title="Both"
          index={2}
        /> */}
          </div>

          {/* Package Prices */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              <IconContext.Provider value={{ color: Colors.BLACK, size: 25 }}>
                <GiStopwatch />
              </IconContext.Provider>
              <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                Select Package
              </font>
            </div>

            <div>
              <PricesContent title="Regular" />
              <PricesContent title="Premium" />
            </div>
          </div>

          {/* Date & Time Selection */}
          {selectedService !== null ? (
            <div style={styles.dateTimeContainer}>
              <div style={styles.packagePriceSubContainer}>
                <IconContext.Provider value={{ color: Colors.BLACK, size: 25 }}>
                  <GiStopwatch />
                </IconContext.Provider>
                <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                  Select Date & Time
                </font>
              </div>

              <div style={{ marginTop: 10, marginLeft: 31 }}>
                <DatePicker
                  required={true}
                  value={date}
                  onChange={(val) => setDate(val)}
                />
                <br />
                <br />
                <Select
                  value={selectedTime}
                  onChange={(val) => setselectedTime(val)}
                  options={options}
                />
              </div>
            </div>
          ) : null}

          {/* Next Button */}
          <button
            onClick={submit}
            style={{
              width: "80%",
              backgroundColor: Colors.PRIMARY,
              color: Colors.WHITE,
              marginLeft: "10%",
              borderRadius: 10,
              border: 0,
              marginTop: 16,
              marginBottom: 10,
            }}
          >
            Next
          </button>
        </>
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
    marginLeft: "5%",
    width: "90%",
    boxShadow: `1px 1px 10px ${Colors.GRAY}`,
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
