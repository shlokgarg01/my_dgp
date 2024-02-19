import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GiStopwatch } from "react-icons/gi";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllServices } from "../actions/ServiceActions";
import LoaderComponent from "./Loader";
import { createSearchParams, useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import Btn from "./components/Btn";
import InputGroup from "./components/InputGroup";
import "../styles/ComponentStyles.css";
import { Service } from "../utils/Data/Service";
import Sheet from "react-modal-sheet";
import Picker from "react-scrollable-picker";
import { Dates, Months, Years } from "../utils/Data/Date";
import { toast } from "react-custom-alert";
import { IoMdAlarm } from "react-icons/io";

export default function Home() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [selectedTime, setselectedTime] = useState(1);
  const [selectedMinutes, setselectedMinutes] = useState(10);
  const [address, setAddress] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [date, setDate] = useState({
    year: new Date().getFullYear().toString(),
    month: Months.find(
      (month) =>
        month.value ===
        (new Date().getMonth() + 1 <= 9
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1)
    ).value.toString(),
    date: new Date().getDate(),
  });
  let TAX = 70;

  const dateGroup = {
    year: Years,
    month: Months,
    date: Dates,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, error, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(getAllServices());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    setSelectedService(services[0]?._id);
    setServiceName(services[0]?.name);
  }, [services]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

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
          selectedTime === time ? "0 0 0" : `1px 1px 4px ${Colors.LIGHT_GRAY}`,
        border: selectedTime === time ? `1px solid ${Colors.DARK_GRAY}` : null,
        borderRadius: 4,
      }}
    >
      {time} hr
      {/* <br />
      <div style={{ fontSize: 12, color: Colors.GRAY }}>
        ₹{" "}
        {time *
          services.find((service) => service._id === selectedService)?.charges}
      </div> */}
    </div>
  );

  const SliderContent = ({ title, index }) => (
    <div
      onClick={() => {
        setSelectedServiceIndex(index);

        let package_name = selectedPackageIndex === 0 ? "Regular" : "Premium";
        let a = services.find(
          (service) => service.name === `${Service[index].name} ${package_name}`
        );
        setSelectedService(a._id);
        setServiceName(a.name);
      }}
      style={styles.serviceSliderImageContainer}
    >
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

  const PricesContent = ({ title, index }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 13,
        fontSize: 16,
        borderRadius: 7,
        marginLeft: 34,
        boxShadow:
          selectedPackageIndex === index
            ? `1px 1px 4px ${Colors.LIGHT_GRAY}`
            : null,
        border:
          selectedPackageIndex === index ? `1px solid ${Colors.GRAY}` : null,
      }}
      onClick={() => {
        let a = services.find(
          (service) =>
            service.name === `${Service[selectedServiceIndex].name} ${title}`
        );

        setSelectedPackageIndex(index);
        setSelectedService(a._id);
        setServiceName(a.name);
      }}
    >
      <div>{title}</div>
      {loading === false ? (
        <div>
          ₹{" "}
          {services.find(
            (x) => x.name === `${Service[selectedServiceIndex].name} ${title}`
          ).charges * selectedTime}
          /hr
        </div>
      ) : null}
    </div>
  );

  const getItemPrice = () => {
    let charges = services.find((x) => x._id === selectedService).charges;
    return charges * selectedTime;
  };

  const submit = () => {
    if (!address) {
      toast.error("Please enter valid address");
      return;
    } else if (!selectedService) {
      toast.error("Plese select a service");
      return;
    }

    navigate({
      pathname: "/details",
      search: createSearchParams({
        service: selectedService,
        serviceName,
        date: `${date.year}-${date.month}-${date.date}`,
        hours: selectedTime,
        address,
        taxPrice: TAX,
        itemsPrice: getItemPrice(),
        totalPrice: getItemPrice() + TAX,
      }).toString(),
    });
  };

  return (
    <div>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div style={{ backgroundColor: Colors.WHITE }}>
          <div
            style={{
              height: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                marginTop: -16,
                // marginBottom: 16,
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

          {/* Services Slider */}
          <div style={styles.serviceSliderContainer}>
            {Service.map((service, index) => (
              <SliderContent
                // image={require("../images/camera.png")}
                title={service.name}
                index={service.index}
              />
            ))}
          </div>

          {/* Duration Selection */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <GiStopwatch color={Colors.BLACK} size={25} />
                <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                  Duration
                </font>
              </div>

              {/* Date Selection */}
              <div
                style={{
                  width: "16%",
                  padding: 4,
                  borderRadius: 7,
                  boxShadow: `1px 1px 4px ${Colors.GRAY}`,
                  marginLeft: "55%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setIsBottomSheetOpen(true)}
                >
                  {new Date(`${date.year}-${date.month}-${date.date}`).setHours(
                    0,
                    0,
                    0,
                    0
                  ) === new Date().setHours(0, 0, 0, 0) ? (
                    <>
                      <IoMdAlarm color={Colors.BLACK} size={25} />
                      Now
                    </>
                  ) : (
                    `${date.year}-${date.month}-${date.date}`
                  )}
                </div>
              </div>
            </div>

            <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {/* + - minutes component */}
              <div
                style={{
                  backgroundColor: Colors.WHITE,
                  margin: 10,
                  marginTop: 0,
                  display: "inline-flex",
                  // flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  width: 70,
                  fontWeight: "bold",
                  fontSize: 17,
                  boxShadow: `1px 1px 4px ${Colors.LIGHT_GRAY}`,
                  border: `1px solid ${Colors.DARK_GRAY}`,
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 17,
                  }}
                >
                  <div
                    style={{ marginRight: 1, fontSize: 22 }}
                    onClick={() =>
                      selectedMinutes > 10
                        ? setselectedMinutes(selectedMinutes - 1)
                        : null
                    }
                  >
                    -
                  </div>
                  {selectedMinutes}
                  <div
                    style={{ marginLeft: 2, fontSize: 22 }}
                    onClick={() => setselectedMinutes(selectedMinutes + 1)}
                  >
                    +
                  </div>
                </div>
                {/* <div style={{ fontSize: 12, color: Colors.GRAY }}>mins.</div> */}
              </div>

              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (item) => (
                  <TimeSlider time={item} />
                )
              )}
            </div>
          </div>

          {/* Package Prices */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              <GiStopwatch color={Colors.BLACK} size={25} />
              <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                Select Package
              </font>
            </div>

            <div>
              <PricesContent title="Regular" index={0} />
              <PricesContent title="Premium" index={1} />
            </div>
          </div>

          {/* Next Button */}
          <Btn title="Next" onClick={submit} />

          <Sheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            detent="content-height"
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <Picker
                  optionGroups={dateGroup}
                  valueGroups={date}
                  onChange={(name, val) => setDate({ ...date, [name]: val })}
                />
                <Btn title="Save" onClick={() => setIsBottomSheetOpen(false)} />
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
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
    overflowX: "auto",
    whiteSpace: "nowrap",
    paddingTop: 7,
    paddingBottom: 7,
  },
  serviceSliderImageContainer: {
    textAlign: "center",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
    marginBottom: 7,
    marginRight: 10,
    width: 100,
  },
  serviceSliderImage: { height: 40, width: 58 },
  packagePricesContainer: {
    marginLeft: "2.5%",
    width: "95%",
    padding: 10,
    borderRadius: 7,
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
