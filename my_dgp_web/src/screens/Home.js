import React, { useState, useEffect } from "react";
import { GiStopwatch } from "react-icons/gi";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllServices } from "../actions/ServiceActions";
import { getAllPackages } from "../actions/PackageActions";
import { getAllPrices } from "../actions/PriceActions";
import LoaderComponent from "../components/Loader";
import { createSearchParams, useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import Btn from "../components/components/Btn";
import "../styles/ComponentStyles.css";
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
import HamburgerMenu from "../components/components/HamburgerMenu";
import { saveData } from "../actions/DataActions";
import axios from "axios";

export default function Home() {
  const { savedData } = useSelector((state) => state.savedData);

  const [selectedService, setSelectedService] = useState(savedData.service);
  const [serviceName, setServiceName] = useState(savedData.serviceName || "");
  const [subService, setSubService] = useState(savedData.subService);
  const [subServiceName, setSubServiceName] = useState(
    savedData.subServiceName || ""
  );
  const [servicePackage, setPackage] = useState(savedData.servicePackage);
  const [packageName, setPackageName] = useState(savedData.packageName || "");
  const [selectedHours, setSelectedHours] = useState(savedData.hours || 0);
  const [selectedMinutes, setselectedMinutes] = useState({
    hours: savedData.hours || "00",
    minutes: savedData.minutes || "01",
  });
  const [isMinutesSheetOpen, setIsMinutesSheetOpen] = useState(false);
  const [address, setAddress] = useState(savedData.address);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [increaseMapHeight, setIncreaseMapHeight] = useState(false);
  const [location, setLocation] = useState([
    parseFloat(savedData.lat) || 28.570679971663644,
    parseFloat(savedData.lng) || 77.16227241314306,
  ]);
  let TAX = 99;
  const [isRegularActive, setRegularActive] = useState(false);
  const [isStandardActive, setStandardActive] = useState(false);

  const currentTime = () => {
    return {
      date: new Date().toString().slice(4, 15),
      hour:
        new Date().getHours() % 12 === 0 // if hour is 12, then it should set 12 not 00
          ? `12`
          : new Date().getHours() % 12 <= 9
            ? `0${new Date().getHours() % 12}`
            : `${new Date().getHours() % 12}`,
      ampm: new Date()
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .slice(-2),
      quaters: "00",
    };
  };
  const [date, setDate] = useState(currentTime());
  const [currentAMPM] = useState(currentTime().ampm);

  const getDates = () => {
    let dates = [];

    for (let i = 0; i < 7; ++i) {
      let date = new Date(Date.now() + 3600 * 1000 * 24 * i);
      let label = date.toString().slice(4, 10).split(" ");
      label = label[1] + " " + label[0];

      dates.push({
        value: date.toString().slice(4, 15),
        label,
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
  const {
    prices,
    error: priceError,
    loading: priceLoading,
  } = useSelector((state) => state.prices);
  const {
    packages,
    error: packageError,
    loading: packageLoading,
  } = useSelector((state) => state.packages);

  const fetchLiveLocation = (pos) => {
    var crd = pos.coords;
    if (crd) setLocation([crd.latitude, crd.longitude]);
  };

  const locationFetchingError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  // fetching User's Live Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };

          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              fetchLiveLocation,
              locationFetchingError,
              options
            );
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              fetchLiveLocation,
              locationFetchingError,
              options
            );
          } else if (result.state === "denied") {
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  //reverse geocode => (lat/long to address)
  useEffect(() => {
    if (location) {
      const fetchAddress = async () => {
        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
              lat: location[0],
              lon: location[1],
              format: 'json',
            },
          });
          setAddress(response.data.display_name);
        } catch (error) {
          console.log("reverse geo code failed: ", error);
          // setError('Failed to fetch address');
        }
      };
      fetchAddress();
    }
  }, [location]);

  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllPackages());
    dispatch(getAllPrices());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, packageError, priceError]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const handleMapHeightChange = (val) => setIncreaseMapHeight(val)

  const TimeSlider = ({ time }) => (
    <div
      onClick={() => {
        setselectedMinutes({
          hours: "00",
          minutes: "00",
        });
        setSelectedHours(time);
      }}
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

  const ServiceSlider = ({ service, index, icon }) => (
    <div
      onClick={() => {
        setServiceName(service.name);
        setSelectedService(service._id);
      }}
      style={styles.serviceSliderImageContainer}
    >
      {/* In order to make page non-scrollable, we remove icon once sub-service is selected */}
      {!subService ? icon : null}
      <div
        style={{
          color: service.name === serviceName ? Colors.PRIMARY : Colors.GRAY,
          fontWeight: "bold",
        }}
      >
        {service.name}
      </div>
      <div
        style={{
          border:
            service.name === serviceName ? `1px solid ${Colors.PRIMARY}` : null,
          width: "50%",
          marginLeft: "25%",
          borderRadius: 100,
        }}
      />
    </div>
  );

  const SubServiceSlider = ({ subService }) => (
    <div
      onClick={() => {
        setSubServiceName(subService.name);
        setSubService(subService._id);
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
            subService.name === subServiceName ? Colors.PRIMARY : Colors.GRAY,
          fontWeight: "bold",
          overflow: "hidden",
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "2",
          width: "auto",
        }}
      >
        {subService.name}
      </div>
      <div
        style={{
          border:
            subService.name === subServiceName
              ? `1px solid ${Colors.PRIMARY}`
              : null,
          width: "50%",
          marginLeft: "25%",
          borderRadius: 100,
        }}
      />
    </div>
  );

  const PricesContent = ({ p, index, isActive }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.SECONDARY,
        alignItems: "center",
        marginBottom: 10,
        padding: 12,
        fontSize: 14,
        borderRadius: 7,
        color: isActive ? 'black' : 'grey',
        boxShadow:
          p.name === packageName ? `1px 1px 4px ${Colors.LIGHT_GRAY}` : null,
        border: p.name === packageName ? `1px solid ${Colors.GRAY}` : null,
      }}
      onClick={() => {
        if (!isActive) {
          toast.error("Please increase duration for this service");
          return;
        }
        setPackageName(p.name);
        setPackage(p._id);
      }}
    >
      <div>{p.name}</div>
      {loading === false ? (
        <div>
          ₹{" "}
          {prices.find((price) => price.name === `${serviceName} ${p.name}`)
            .charges *
            (selectedHours === 0
              ? parseInt(selectedMinutes.hours) * 60 +
              parseInt(selectedMinutes.minutes)
              : selectedHours * 60)}
        </div>
      ) : null}
    </div>
  );

  const getItemPrice = () => {
    let charges = prices.find(
      (price) => price.name === `${serviceName} ${packageName}`
    )?.charges;
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
      toast.error("Please select a service");
      return;
    } else if (!packageName) {
      toast.error("Please select a package");
      return;
    }

    let finalDate = `${date.date.slice(7, 11)}-${Months.find((month) => month.abr === date.date.slice(0, 3)).value
      }-${date.date.slice(4, 6)}`;
    let res = {
      service: selectedService,
      subService,
      servicePackage,
      packageName,
      serviceName,
      subServiceName,
      date: finalDate,
      hours:
        selectedMinutes.hours === "00" ? selectedHours : selectedMinutes.hours,
      minutes: selectedMinutes.minutes,
      address,
      lat: location[0],
      lng: location[1],
      taxPrice: TAX,
      itemsPrice: getItemPrice(),
      totalPrice: getItemPrice() + TAX,
    };

    dispatch(saveData(res));
    navigate({
      pathname: "/details",
      search: createSearchParams(res).toString(),
    });
  };


  const handleServicesState = () => {
    if (selectedHours > 0 || selectedMinutes.hours > 0) {
      setStandardActive(true)
      setRegularActive(true)
      return;
    }
    if (selectedMinutes.minutes > 29) {
      setStandardActive(true)
    }
  }

  useEffect(() => {
    handleServicesState()
  }, [selectedMinutes])

  //add buffer hour to prevent past time bookings
  const addHour = (hour) => {
    const bufferHr = 1;
    if (parseInt(hour) < 9) {
      //added 0 before number for single digit
      return `0${parseInt(hour) + bufferHr}`
    }
    else {
      return (parseInt(hour) + bufferHr).toString();
    }
  }

  return loading || packageLoading || priceLoading ? (
    <LoaderComponent />
  ) : (
    <>
      <HamburgerMenu />
      <div style={{ backgroundColor: Colors.WHITE, minHeight: "100%" }}>
        {/* Map */}
        <div
          style={{
            height: '680px',
            // height: (subService && !increaseMapHeight) ? "150px" : "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: -1000,
          }}
        >
          <MapComponent
            style={{ height: 200, width: 200 }}
            onSearchChange={setAddress}
            handleLocationChange={handleLocationChange}
            initialLocation={location}
            searchValue={address}
            isEditable={true}
            increaseMapHeight={handleMapHeightChange}
            subService={subService}
            setServiceName={setServiceName}
          />
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: 'white' }}>
          {/* Tag line */}
          <div
            style={{
              textAlign: "center",
              backgroundColor: Colors.PRIMARY,
              color: Colors.WHITE,
              paddingTop: 7,
              paddingBottom: 7,
              // fontSize: 14,
            }}
          >
            Book a photographer & videographer instantly.
          </div>

          {/* Services Slider */}
          <div style={{ ...styles.serviceSliderContainer }}>
            {services.map((service, index) => (
              <ServiceSlider
                key={index}
                service={service}
                index={index}
                icon={
                  service.name === "Photography" ? (
                    <MdOutlineAddAPhoto
                      size={25}
                      color={
                        serviceName === service.name
                          ? Colors.PRIMARY
                          : Colors.GRAY
                      }
                    />
                  ) : service.name === "Videography" ? (
                    <MdOutlineVideocam
                      size={25}
                      color={
                        serviceName === service.name
                          ? Colors.PRIMARY
                          : Colors.GRAY
                      }
                    />
                  ) : (
                    <MdOutlineVideoCameraFront
                      size={25}
                      color={
                        serviceName === service.name
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
          {serviceName && (
            <div
              style={{
                ...styles.serviceSliderContainer,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              {services
                .find((service) => service.name === serviceName)
                ?.subServices.map((subService) => (
                  <SubServiceSlider
                    key={subService._id}
                    subService={subService}
                  />
                ))}
            </div>
          )}

          {/* Banner */}
          {(!serviceName || !subService) && (
            <div style={{ margin: 10 }}>
              <img
                alt="Banner"
                src={Banner}
                style={{ width: "100%", borderRadius: 10 }}
              />
            </div>
          )}

          {serviceName && subServiceName && (
            <>
              {/* Duration Selection */}
              <div
                style={{
                  ...styles.packagePricesContainer,
                  borderBottom: "0.5px solid grey",
                }}
              >
                <div
                  style={{
                    ...styles.packagePriceSubContainer,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", paddingRight: 10, width: "70%" }}>
                    {/* <GiStopwatch color={Colors.BLACK} size={25} /> */}
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 18 }}>
                        Select service duration
                      </div>
                      <div style={{ color: Colors.GRAY, fontSize: 12 }}>
                        min. 1 minute to maximum time as you wish
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div
                    style={{
                      width: "30%",
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
                      onClick={() => {
                        setIsBottomSheetOpen(true)
                        setDate({ ...date, hour: addHour(currentTime().hour) })
                      }}
                    >
                      {new Date(
                        `${date.year}-${date.month}-${date.date}`
                      ).setHours(date.hour, 0, 0, 0) ===
                        new Date().setHours(
                          new Date().getHours() % 12,
                          0,
                          0,
                          0
                        ) && currentAMPM === date.ampm ? (
                        <>
                          <IoMdAlarm color={Colors.BLACK} size={25} />
                          Now
                        </>
                      ) : (
                        <div style={{ fontSize: 13 }}>
                          {date.date.slice(0, 6)}
                          <br />
                          {date.hour}:{date.quaters} {date.ampm}
                        </div>
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
                        onClick={() => {
                          setSelectedHours(0);
                          if (parseInt(selectedMinutes.minutes) > 0) {
                            setselectedMinutes({
                              hours: selectedMinutes.hours,
                              minutes: parseInt(selectedMinutes.minutes) - 1,
                            });
                          }
                        }}
                      >
                        -
                      </div>
                      <div onClick={() => setIsMinutesSheetOpen(true)}>
                        {selectedMinutes.hours}:
                        {typeof selectedMinutes.minutes === "string" ||
                          selectedMinutes.minutes === "00"
                          ? selectedMinutes.minutes
                          : selectedMinutes.minutes <= 9
                            ? `0${selectedMinutes.minutes}`
                            : selectedMinutes.minutes}
                      </div>
                      <div
                        style={{ marginLeft: 2, fontSize: 22 }}
                        onClick={() => {
                          setSelectedHours(0);
                          if (parseInt(selectedMinutes.minutes) < 59) {
                            setselectedMinutes({
                              hours: selectedMinutes.hours,
                              minutes:
                                parseInt(selectedMinutes.minutes) + 1 <= 9
                                  ? `0${parseInt(selectedMinutes.minutes) + 1}`
                                  : `${parseInt(selectedMinutes.minutes) + 1}`,
                            });
                          } else if (parseInt(selectedMinutes.minutes) === 59) {
                            setselectedMinutes({
                              hours: `0${parseInt(selectedMinutes.hours) + 1}`,
                              minutes: "00",
                            });
                          }
                        }}
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
                  <GiStopwatch color={Colors.BLACK} size={19} />
                  <font
                    style={{ fontWeight: "bold", marginLeft: 10, fontSize: 13 }}
                  >
                    {`Select Service (${selectedHours === 0
                      ? `${parseInt(selectedMinutes.hours)}hr ${parseInt(
                        selectedMinutes.minutes
                      )} min`
                      : selectedHours + "hr"
                      } ${serviceName && serviceName.split(" ")[0]
                      } for ${subServiceName})`}
                  </font>
                </div>

                {packages.map((p, index) => (
                  <div>
                    <PricesContent p={p} index={index} isActive={index == 2 ? true : (index == 0 ? isRegularActive : isStandardActive)} />
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={submit}
                style={{
                  width: "100%",
                  height: 52,
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  borderRadius: 0,
                  border: 0,
                  // marginTop: 25,
                  fontSize: 20,
                }}
              >
                Proceed
              </button>
            </>
          )}
        </div>


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
                  onClick={() => {
                    setDate(currentTime())
                    setIsBottomSheetOpen(false)
                  }}
                />
              </div>
              <div style={{ fontSize: 13 }}>
                <Picker
                  optionGroups={dateGroup}
                  valueGroups={date}
                  onChange={(name, val) => {
                    setDate({ ...date, [name]: val })
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 173,
                  left: "50%",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                :
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Btn
                  smallButton={true}
                  title="Save"
                  onClick={() => setIsBottomSheetOpen(false)}
                />
                <Btn
                  smallButton={true}
                  title="Refresh"
                  onClick={() => setDate({ ...date, hour: addHour(currentTime().hour) })
                  }
                />
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
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  paddingRight: 7,
                  paddingLeft: 16,
                }}
              >
                <div
                  style={{ width: "50%", textAlign: "center", fontSize: 19 }}
                >
                  Hours
                </div>
                <div
                  style={{ width: "50%", textAlign: "center", fontSize: 19 }}
                >
                  Minutes
                </div>
              </div>
              <Picker
                optionGroups={minutesGroup}
                valueGroups={selectedMinutes}
                onChange={(name, val) => {
                  if (name === "hours")
                    setselectedMinutes({ ...selectedMinutes, [name]: val });
                  else {
                    setselectedMinutes({
                      ...selectedMinutes,
                      [name]:
                        val === "00"
                          ? val
                          : parseInt(val) <= 9
                            ? `0${parseInt(val)}`
                            : val,
                    });
                  }
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 173,
                  left: "50%",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                :
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Btn
                  smallButton={true}
                  title="Save"
                  onClick={() => {
                    setSelectedHours(0);
                    setIsMinutesSheetOpen(false);
                  }}
                />
                <Btn
                  smallButton={true}
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
      </div >
    </>
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
    padding: 12,
    borderBottom: "0.5px solid grey",
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
