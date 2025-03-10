import React, { useState, useEffect, useRef } from "react";
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
import { FaInfoCircle } from 'react-icons/fa';
import { confirmBookingStatus } from "../actions/BookingActions";
import {
  MdOutlineAddAPhoto,
  MdOutlineVideocam,
  MdOutlineVideoCameraFront,
} from "react-icons/md";
import Banner from "../images/desktop_banner.jpg";
import HamburgerMenu from "../components/components/HamburgerMenu";
import { saveData } from "../actions/DataActions";
import axios from "axios";
import DemoContentModal from "../components/components/DemoContentModal/DemoContentModal";
import FeedbackComponent from "./Feedback/FeedbackComponent";
import Enums from "../utils/Enums";
import { loginViaOTP } from "../actions/UserActions";
import { BASE_URL } from "../config/Axios";

export default function Home() {
  const { savedData } = useSelector((state) => state.savedData);

  const [selectedService, setSelectedService] = useState(savedData.service);
  const [serviceName, setServiceName] = useState(savedData.serviceName || "");
  const [subService, setSubService] = useState(savedData.subService);
  const [subServiceName, setSubServiceName] = useState(
    savedData.subServiceName || ""
  );
  const [packages,setPackages] = useState();
  const [selectedPrice,setSelectedPrice] = useState();
  const [demoImages, setDemoImages] = useState();
  const [description,setDescription] = useState();
  const [servicePackage, setPackage] = useState(savedData.servicePackage);
  const [packageName, setPackageName] = useState(savedData.packageName || "");
  const [selectedHours, setSelectedHours] = useState(savedData.hours || 1);
  const [selectedMinutes, setselectedMinutes] = useState({
    hours: savedData.hours || "01",
    minutes: savedData.minutes || "00",
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
  const [showEyeButton, setShowEyeButton] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const { status, service_provider, booking } = useSelector(
    (state) => state.confirmedBooking//get booking from id
  );
  const [isFeedbackVisible,setIsFeedbackVisible] = useState(false)
  const [activeBookings,setActiveBookings] = useState();

    const currentTime = () => {
    const now = new Date();

    // Get current hour in 12-hour format
    const hour = now.getHours() % 12 === 0
      ? `12`
      : now.getHours() % 12 <= 9
        ? `0${now.getHours() % 12}`
        : `${now.getHours() % 12}`;

    // Get AM/PM
    const ampm = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).slice(-2);

    // Get current minutes and determine the quarter
    const minutes = now.getMinutes();
    let quarter;
    if (minutes < 15) {
      quarter = "00";
    } else if (minutes < 30) {
      quarter = "15";
    } else if (minutes < 45) {
      quarter = "30";
    } else {
      quarter = "45";
    }

    return {
      date: now.toString().slice(4, 15),
      hour: hour,
      ampm: ampm,
      quarters: quarter,
    };
  };

  console.log(currentTime());

  const [date, setDate] = useState(currentTime());
  const [currentAMPM] = useState(currentTime().ampm);

  const getDates = () => {
    let dates = [];

    for (let i = 0; i < 7; ++i) {
      let date = new Date(Date.now() + 3600 * 1000 * 24 * i);
      let label = date.toString().slice(0, 10).split(" ");
      label = label[0] + "," + label[2] + " " + label[1];

      dates.push({
        value: date.toString().slice(4, 15),
        label,
      });
    }
    return dates;
  };

  //disabled right click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const isLogin = () => {
      if (localStorage.getItem('userId')) {
        return true;
      } else {
        return false;
      }
    }
    if(isLogin()){
      dispatch(loginViaOTP({contactNumber:localStorage.getItem('userNumber')}))
    }
    fetchActiveBookings(localStorage.getItem('userId'))
  }, [])
  
  //unselects sub category when category changes
  useEffect(() => {
   setSubService(null);
   setSubServiceName(null)
   setPackages(null)
   setSelectedPrice(null)
  }, [selectedService])

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
    // dispatch(getAllPackages());
    // dispatch(getAllPrices());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const handleMapHeightChange = (val) => setIncreaseMapHeight(val)

  const toggleShowEyeButton = (index) => {
    setShowEyeButton((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
        height: 40,
        flex: "0.05  0 50px",
        fontWeight: "bold",
        fontSize: 16,
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
      <div
        style={{
          color: service.name === serviceName ? Colors.WHITE : Colors.BLACK,
          fontWeight: "bold",
          backgroundColor: service.name === serviceName ? Colors.PRIMARY : Colors.LIGHT_GRAY,
          borderRadius:14,
          paddingRight:14,
          paddingLeft:14,
          paddingTop:4,
          paddingBottom:4,
          marginRight:4,
        }}
      >
        {service.name}
      </div>
    </div>
  );

  useEffect(() => {
    if(JSON.parse(localStorage.getItem("feedback"))?.bookingId){
      dispatch(confirmBookingStatus(JSON.parse(localStorage.getItem("feedback"))?.bookingId));
    }
    },[])

    useEffect(() => {
      if(JSON.parse(localStorage.getItem("feedback"))?.bookingId){
        setIsFeedbackVisible(booking?.status === Enums.BOOKING_STATUS.COMPLETED)
      }
    },[booking])

  const SubServiceSlider = ({ subService }) => {
    return (
      <div
        onClick={() => {
            setSubServiceName(subService.name);
            setSubService(subService._id);
            setPackages(subService?.packages)
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
          subService.name === subServiceName ? Colors.WHITE : Colors.BLACK,
          fontWeight: "600",
          overflow: 'visible',
          fontSize: 16,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "2",
          width: "auto",
          userSelect:'none',
          backgroundColor: subService.name === subServiceName ? Colors.PRIMARY : Colors.LIGHT_GRAY,
          borderRadius:14,
          paddingRight:14,
          paddingLeft:14,
          paddingTop:4,
          paddingBottom:4
        }}
      >
        {subService.name}
      </div>
    </div>
  )};

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
        height:60,
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
        setSelectedPrice(p?.charges)
        setDemoImages(p?.demoLinks ?? [])
        setDescription(p?.description ?? '')
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {p.name}
        <div className="tooltip-center" onClick={() => toggleShowEyeButton(index)}>
          <FaInfoCircle style={{ cursor: 'pointer', marginLeft: 8 }} />
        </div>
        {showEyeButton[index] && (
          <DemoContentModal
          style={isDesktop && {width:'50%'}}
            onClose={() => toggleShowEyeButton(index)}
            excessCharge={Math.round(p?.charges)}
            price={
              Math.round(p?.charges *
                (selectedHours === 0
                  ? parseInt(selectedMinutes.hours) * 60 +
                  parseInt(selectedMinutes.minutes)
                  : selectedHours * 60))
            }
            packageName={`${p.name}`}
            description={description}
            images={demoImages}
          />
        )}
      </div>      {loading === false ? (
        <div>
          ₹{" "}
          {Math.round(p?.charges *
            (selectedHours === 0
              ? parseInt(selectedMinutes.hours) * 60 +
              parseInt(selectedMinutes.minutes)
              : selectedHours * 60))}
        </div>
      ) : null}
    </div>
  );

  const getItemPrice = () => {
    let charges = selectedPrice;
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

  const parseDateTime = (timeObject) => {
    const dateString = timeObject.date;
    const hour = parseInt(timeObject.hour, 10);
    const ampm = timeObject.ampm;
    const quarters = timeObject.quarters;

    // Handle 12-hour to 24-hour conversion
    const hour24 = ampm === "PM" && hour !== 12 ? hour + 12 : (ampm === "AM" && hour === 12 ? 0 : hour);

    // Parse the date string
    const dateParts = dateString.split(" ");
    const month = dateParts[0];
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    // Create a Date object
    const date = new Date(`${month} ${day}, ${year} ${hour24}:${quarters}`);
    return date;
  };

  const compareTimes = (timeObject1, timeObject2) => {
    const date1 = parseDateTime(timeObject1);
    const date2 = parseDateTime(timeObject2);
    console.log(date1)
    console.log(date2)
    if (date1 < date2) {
      setDate({ ...date, hour: addHour(currentTime().hour) }) 
      // toast.error("You can't book on a previous date and time.");
      return false;
    }
    return true
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

    // const checktime = compareTimes(date, currentTime())
    // if (!checktime)
    //   return
    compareTimes(date, currentTime())

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
      pathname: "/Login",
      search: createSearchParams(res).toString(),
    });
  };


  const handleServicesState = () => {
    console.log(selectedHours, 'hh');
    console.log(selectedMinutes.hours, 'hh2');
    if (selectedHours > 0 || selectedMinutes.hours > 0) {
      setStandardActive(true)
      setRegularActive(true)
      return;
    }
    if (selectedMinutes.minutes > 29) {
      setStandardActive(true)
      return;
    }
    setStandardActive(false)
    setRegularActive(false)
  }

  useEffect(() => {
    handleServicesState()
  }, [selectedMinutes, selectedHours])

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

  const DraggableScroll = ({ children }) => {
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollRef = useRef(null);
  
    const onMouseDown = (e) => {
      setIsDown(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    };
  
    const onMouseLeave = () => {
      setIsDown(false);
    };
  
    const onMouseUp = () => {
      setIsDown(false);
    };
  
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scroll speed
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };
  
    return (
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ overflowX: 'auto', cursor: isDown ? 'grabbing' : 'grab' }}
      >
        <div style={{ display: 'flex',alignItems:'center' }}>
          {children}
        </div>
      </div>
    );
  };

  const fetchActiveBookings = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/customer/bookings/activeBookings`, {
        params: { _id: id },
      });
      setActiveBookings(response?.data?.bookings);
    } catch (error) {
      console.error("Error fetching active bookings:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  const currentBookingStrip = () => {
    return (
      <div style={{padding: 10, fontWeight:'400'}}>
        Your Active Bookings
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {activeBookings?.map((booking, index) => (
          <div
            key={index}
            style={{
              backgroundColor: Colors.LIGHT_GRAY,
              color: Colors.BLACK,
              padding: 6,
              borderRadius: 5,
              fontWeight: '500',
              marginRight:10,
              marginTop:10,
              minWidth: '93vw',
            }}
            onClick={() => { navigate('/booking-details', { state: { bookingId: booking?._id } }) }}
          >
            {booking?.service?.name} {booking?.subService?.name}
            <div style={{ color: Colors.DARK_GRAY, fontSize: 12 }}>
              {new Date(booking?.date).toLocaleDateString()} • {booking?.status}
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  };

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <HamburgerMenu />
      <div style={{ backgroundColor: Colors.WHITE, minHeight: "100%" }}>
        {/* Map */}
        <div
          style={{
            height: '100vh',
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

        <div className="homepage-container" >
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
            Book services instantly
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
                {isDesktop ? <DraggableScroll>
                  {services
                    .find((service) => service.name === serviceName)
                    ?.subServices.map((subService) => (
                      <SubServiceSlider
                        key={subService._id}
                        subService={subService}
                      />
                    ))}
                </DraggableScroll> :
                  services
                    .find((service) => service.name === serviceName)
                    ?.subServices.map((subService) => (
                      <SubServiceSlider
                        key={subService._id}
                        subService={subService}
                      />
                    ))}
              </div>
            )}

{!serviceName && activeBookings?.length > 0 && currentBookingStrip()}


          {/* Banner */}
          {(!serviceName || !subService) && (
            <div className="home-banner">
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
                        min. 1 hour to maximum time as you wish
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div
                    style={{
                      width: "30%",
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
                          <IoMdAlarm color={Colors.BLACK} size={22} />
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
                  {/* <div
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
                  </div> */}

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

                {/* {packages.map((p, index) => (
                  <div>
                    <PricesContent p={p} index={index} isActive={index == 2 ? true : (index == 0 ? isRegularActive : isStandardActive)} />
                  </div>
                ))} */}
                <div style={styles.packageList}>
                {packages?.map((p, index) => (
                  <div  >
                    <PricesContent p={p} index={index} isActive={true} />
                  </div>
                ))}
                </div>

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

<Sheet
          isOpen={isFeedbackVisible}
          onClose={() => setIsFeedbackVisible(false)}
          detent="content-height"
          disableDrag={true}
          className="app-content"
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
             <FeedbackComponent setIsFeedbackVisible={setIsFeedbackVisible}/>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        </div>


        <Sheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          detent="content-height"
          disableDrag={true}
          style={isDesktop && {width:'50%'}}
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
              <div style={{ fontSize: 11 }}>
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
    paddingTop: 8,
    paddingBottom:8,
    paddingLeft:8,
    borderBottom: "0.5px solid grey",
  },
  serviceSliderImageContainer: {
    textAlign: "center",
    // whiteSpace: "pre-wrap",
    cursor: "pointer",
        marginRight: 4,
    paddingTop: 8,
    paddingBottom:8,
    paddingLeft:8,
  },
  serviceSliderImage: { height: 40, width: 58 },
  packagePricesContainer: {
    padding: 10,
    borderRadius: 7,
  },
  packageList:{
    height:174,
    overflow:"scroll"
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
