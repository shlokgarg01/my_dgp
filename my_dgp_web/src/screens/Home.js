import React, { useState, useEffect } from "react";
import { GiStopwatch } from "react-icons/gi";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllServices } from "../actions/ServiceActions";
import LoaderComponent from "../components/Loader";
import { createSearchParams, useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import Btn from "../components/components/Btn";
import "../styles/ComponentStyles.css";
import { Service } from "../utils/Data/Service";
import Sheet from "react-modal-sheet";
import Picker from "react-scrollable-picker";
import { Hours, AmPm, Minutes, Months, Quaters } from "../utils/Data/Date";
import { toast } from "react-custom-alert";
import { IoMdAlarm, IoMdClose } from "react-icons/io";
import {
  MdOutlineAddAPhoto,
  MdOutlineVideocam,
  MdOutlineVideoCameraFront,
} from "react-icons/md";
import Banner from "../images/desktop_banner.jpg";

export default function Home() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState();
  const [selectedService, setSelectedService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [subService, selectSubService] = useState("");
  const [selectedSubServiceIndex, setSelectedSubServiceIndex] = useState();
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedMinutes, setselectedMinutes] = useState({
    hours: "00",
    minutes: "00",
  });
  const [isMinutesSheetOpen, setIsMinutesSheetOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [location, setLocation] = useState([
    28.570679971663644, 77.16227241314306,
  ]);
  let TAX = 70;

  const currentTime = () => {
    return {
      date: new Date().toString().slice(4, 15),
      hour:
        new Date().getHours() % 12 <= 9
          ? `0${new Date().getHours() % 12}`
          : `${new Date().getHours() % 12}`,
      ampm: new Date()
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .slice(-2),
      quaters: "00",
    };
  };
  const [date, setDate] = useState(currentTime());

  const getDates = () => {
    let dates = [];

    for (let i = 0; i < 7; ++i) {
      let date = new Date(Date.now() + 3600 * 1000 * 24 * i);
      dates.push({
        value: date.toString().slice(4, 15),
        label: date.toString().slice(4, 10),
      });
    }
    return dates;
  };

  const dateGroup = {
    date: getDates(),
    hour: Hours,
    quaters: Quaters,
    ampm: AmPm,
  };

  const minutesGroup = { hours: Hours, minutes: Minutes };
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
    // setSelectedService(services[0]?._id);
    // setServiceName(services[0]?.name);
    // selectSubService(Service[0]?.subServices[0]);
    // setSelectedServiceIndex(0);
  }, [services]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const TimeSlider = ({ time }) => (
    <div
      onClick={() => setSelectedHours(time)}
      style={{
        backgroundColor: Colors.WHITE,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        flex: "0.05  0 50px",
        fontWeight: "bold",
        fontSize: 17,
        boxShadow:
          selectedHours === time ? "0 0 0" : `1px 1px 4px ${Colors.LIGHT_GRAY}`,
        border: selectedHours === time ? `1px solid ${Colors.DARK_GRAY}` : null,
        borderRadius: 4,
      }}
    >
      {time} hr
    </div>
  );

  const ServiceSlider = ({ title, index, icon }) => (
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
      {icon}
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

  const SubServiceSlider = ({ title, index }) => (
    <div
      onClick={() => {
        setSelectedSubServiceIndex(index);
        selectSubService(title);
      }}
      style={{
        ...styles.serviceSliderImageContainer,
        paddingRight: 4,
        paddingLeft: 4,
      }}
    >
      <div
        style={{
          color:
            selectedSubServiceIndex === index ? Colors.PRIMARY : Colors.GRAY,
          fontWeight: "bold",
          overflow: "hidden",
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "2",
          width: "auto",
        }}
      >
        {title}
      </div>
      <div
        style={{
          border:
            selectedSubServiceIndex === index
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
          ).charges *
            (selectedMinutes.hours === "00" && selectedMinutes.minutes === "00"
              ? selectedHours * 60
              : parseInt(selectedMinutes.hours) * 60 +
                parseInt(selectedMinutes.minutes))}
        </div>
      ) : null}
    </div>
  );

  const getItemPrice = () => {
    let charges = services.find((x) => x._id === selectedService)?.charges;
    let time = 0;
    if (charges) {
      time =
        selectedMinutes.hours === "00" && selectedMinutes.minutes === "00"
          ? selectedHours * 60
          : parseInt(selectedMinutes.hours) * 60 +
            parseInt(selectedMinutes.minutes);
    }
    return charges * time; // selected time is in hours & charges need to be calculated based on minutes
  };

  const submit = () => {
    if (!address) {
      toast.error("Please enter valid address");
      return;
    } else if (!selectedService) {
      toast.error("Plese select a service");
      return;
    }

    let finalDate = `${date.date.slice(7, 11)}-${
      Months.find((month) => month.abr === date.date.slice(0, 3)).value
    }-${date.date.slice(4, 6)}`;
    navigate({
      pathname: "/details",
      search: createSearchParams({
        service: selectedService,
        serviceName,
        date: finalDate,
        hours: selectedHours,
        address,
        lat: location[0],
        lng: location[1],
        taxPrice: TAX,
        itemsPrice: getItemPrice(),
        totalPrice: getItemPrice() + TAX,
      }).toString(),
    });
  };

  return loading ? (
    <LoaderComponent />
  ) : (
    <div style={{ backgroundColor: Colors.WHITE, minHeight: "100%" }}>
      <div
        style={{
          height: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MapComponent
          style={{ height: 200, width: 200 }}
          onSearchChange={setAddress}
          handleLocationChange={handleLocationChange}
          initialLocation={location}
          searchValue={address}
        />
      </div>

      {/* Tag line */}
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
        Book photographer & videographers instantly.
      </div>

      {/* Services Slider */}
      <div style={{ ...styles.serviceSliderContainer }}>
        {Service.map((service, index) => (
          <ServiceSlider
            key={index}
            title={service.name}
            index={service.index}
            icon={
              index === 0 ? (
                <MdOutlineAddAPhoto
                  size={25}
                  color={
                    selectedServiceIndex === service.index
                      ? Colors.PRIMARY
                      : Colors.GRAY
                  }
                />
              ) : index === 1 ? (
                <MdOutlineVideocam
                  size={25}
                  color={
                    selectedServiceIndex === service.index
                      ? Colors.PRIMARY
                      : Colors.GRAY
                  }
                />
              ) : (
                <MdOutlineVideoCameraFront
                  size={25}
                  color={
                    selectedServiceIndex === service.index
                      ? Colors.PRIMARY
                      : Colors.GRAY
                  }
                />
              )
            }
          />
        ))}
      </div>

      {/* Sub Service Slider */}
      {selectedService && (
        <div
          style={{
            ...styles.serviceSliderContainer,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          {Service.find(
            (x) => x.name === serviceName?.split(" ")[0]
          )?.subServices.map((subService, index) => (
            <SubServiceSlider key={index} title={subService} index={index} />
          ))}
        </div>
      )}

      {/* Banner */}
      {(!selectedService || !subService) && (
        <div style={{ margin: 10 }}>
          <img src={Banner} style={{ width: "100%", borderRadius: 10 }} />
        </div>
      )}

      {selectedService && subService && (
        <>
          {/* Duration Selection */}
          <div
            style={{
              ...styles.packagePricesContainer,
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                ...styles.packagePriceSubContainer,
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", paddingRight: 10 }}>
                {/* <GiStopwatch color={Colors.BLACK} size={25} /> */}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 18 }}>
                    Select service duration
                  </div>
                  <div style={{ color: Colors.GRAY }}>
                    You can book a service for the timing as per your need
                    (minnimum 1 minute to maximum time as you wish)
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div
                style={{
                  width: "50%",
                  padding: 4,
                  borderRadius: 7,
                  boxShadow: `1px 1px 4px ${Colors.GRAY}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
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
                    <>
                      {date.date.slice(0, 6)}
                      <br />
                      {date.hour}:{date.quaters} {date.ampm}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              {/* + - minutes component */}
              <div
                style={{
                  backgroundColor: Colors.WHITE,
                  marginTop: 0,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  flex: "0.2 0 100px",
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
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <div
                    style={{ marginRight: 1, fontSize: 22 }}
                    onClick={() =>
                      parseInt(selectedMinutes.minutes) > 0
                        ? setselectedMinutes({
                            hours: selectedMinutes.hours,
                            minutes: parseInt(selectedMinutes.minutes) - 1,
                          })
                        : null
                    }
                  >
                    -
                  </div>
                  <div onClick={() => setIsMinutesSheetOpen(true)}>
                    {selectedMinutes.hours}:{selectedMinutes.minutes}
                  </div>
                  <div
                    style={{ marginLeft: 2, fontSize: 22 }}
                    onClick={() =>
                      parseInt(selectedMinutes.minutes) < 59
                        ? setselectedMinutes({
                            hours: selectedMinutes.hours,
                            minutes: parseInt(selectedMinutes.minutes) + 1,
                          })
                        : null
                    }
                  >
                    +
                  </div>
                </div>
              </div>

              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (item, index) => (
                  <TimeSlider key={index} time={item} />
                )
              )}
            </div>
          </div>

          {/* Package Prices */}
          <div style={styles.packagePricesContainer}>
            <div style={styles.packagePriceSubContainer}>
              <GiStopwatch color={Colors.BLACK} size={25} />
              <font style={{ fontWeight: "bold", marginLeft: 10 }}>
                {`Select Service (${
                  serviceName && serviceName.split(" ")[0]
                } - ${subService})`}
              </font>
            </div>

            <div>
              <PricesContent title="Regular" index={0} />
              <PricesContent title="Standard" index={1} />
              <PricesContent title="Premium" index={2} />
            </div>
          </div>

          {/* Next Button */}
          <Btn title="Proceed" onClick={submit} firstScreen={true} />
        </>
      )}

      <Sheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        detent="content-height"
        disableDrag={true}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 16,
                marginRight: 16,
                alignItems: "center",
              }}
            >
              <h3>Schedule a service</h3>
              <IoMdClose
                size={28}
                onClick={() => setIsBottomSheetOpen(false)}
              />
            </div>
            <div>
              <Picker
                optionGroups={dateGroup}
                valueGroups={date}
                onChange={(name, val) => setDate({ ...date, [name]: val })}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Btn title="Save" onClick={() => setIsBottomSheetOpen(false)} />
              <Btn title="Refresh" onClick={() => setDate(currentTime())} />
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>

      <Sheet
        isOpen={isMinutesSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        detent="content-height"
        disableDrag={true}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 16,
                marginRight: 16,
                alignItems: "center",
              }}
            >
              <h3>Selected Duration</h3>
              <IoMdClose
                size={28}
                onClick={() => setIsMinutesSheetOpen(false)}
              />
            </div>
            <Picker
              optionGroups={minutesGroup}
              valueGroups={selectedMinutes}
              onChange={(name, val) =>
                setselectedMinutes({ ...selectedMinutes, [name]: val })
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Btn title="Save" onClick={() => setIsMinutesSheetOpen(false)} />
              <Btn
                title="Refresh"
                onClick={() => {
                  setselectedMinutes({ hours: "00", minutes: "00" });
                }}
              />
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
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
    borderBottom: "1px solid grey",
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
