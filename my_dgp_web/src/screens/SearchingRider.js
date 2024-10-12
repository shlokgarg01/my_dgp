import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Colors from "../utils/Colors";
import SearchRider from "../images/search_rider.png";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  clearErrors,
  confirmBookingStatus,
  createBooking,
} from "../actions/BookingActions";
import Enums from "../utils/Enums";
import { toast } from "react-custom-alert";
import Btn from "../components/components/Btn";
import MapComponent from "../components/MapComponent";
import { IoMdCall } from "react-icons/io";
import { FaShieldAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Loader from "../components/Loader";
import { CONFIRM_BOOKING_STATUS_SUCCESS, CREATE_BOOKING_REQUEST, CREATE_BOOKING_SUCCESS } from "../constants/BookingsConstants";

export default function SearchingRider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(10);
  const { status, service_provider, booking } = useSelector(
    (state) => state.confirmedBooking
  );
  const { loading, isCancelled, error } = useSelector(
    (state) => state.cancelledBooking
  );

  
  const [showDropdown, setShowDropdown] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [tryAgainLoading,setTryAgainLoading] = useState(false);
  const[bookingId , setBookingId]= useState("")
  const[APIbookingId , setAPIBookingId]= useState("")
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    let fetchDataTimeout;
    const fetchData = async () => {
      try {
        if(bookingId.length){
          dispatch(confirmBookingStatus(bookingId));
          setAPIBookingId(bookingId)
        }
        else{
          dispatch(confirmBookingStatus(location.state.bookingId));
          setAPIBookingId(location.state.bookingId)
        }

        fetchDataTimeout = setTimeout(() => {
          fetchData();
        }, 1500);

        if (status === Enums.BOOKING_STATUS.ACCEPTED) {
          clearTimeout(fetchDataTimeout);
          toast.success("Booking Confirmed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setLoadingPercentage((prevPercentage) => {
        return (prevPercentage + 1) % 101;
      });
    }, 25);
  

    if (isCancelled || status === Enums.BOOKING_STATUS.CANCELLED ) {
      // debugger
      if (isCancelled) {
        toast.success("Booking Cancelled");
        navigate("/");
        dispatch({ type: 'RESET_STORE' });
        localStorage.removeItem("data")
      }
      if (status === Enums.BOOKING_STATUS.CANCELLED)
        // toast.error(
        //   "No service provider is available to accept. Please book after sometime."
        // );
      clearInterval(interval);
      clearTimeout(fetchDataTimeout);
     // navigate("/");
     if(bookingId.length){
     if(bookingId == APIbookingId)
        setTryAgain(true);
     else
        setTryAgain(false);
      }
      else
        setTryAgain(true)
      //  alert(APIbookingId)
      //  alert(`${bookingId} data`)
      //  alert(`${location.state.bookingId} location.state.bookingId`)
      }

    return () => {
      clearInterval(interval);
      clearTimeout(fetchDataTimeout);
    };
  }, [
    dispatch,
    location.state.bookingId,
    status,
    error,
    isCancelled,
    navigate,
    bookingId
  ]);

  const SOS = ({ Icon, color, text, link, width }) => (
    <div
      style={{
        backgroundColor: Colors.WHITE,
        borderRadius: 100,
        padding: "4px 10px",
        // marginLeft: "auto",
        width,
        boxShadow: "0px 0px 16px lightgray",
        fontWeight: 600,
        marginTop: 16,
        marginRight: 10,
      }}
    >
      <a
        href={link}
        style={{
          fontSize: 17,
          marginLeft: 7,
          textDecoration: "none",
          color,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {text}
        <Icon color={color} size={20} />
      </a>
    </div>
  );

  const cancelTheBooking = () => {
    dispatch(cancelBooking(location.state.bookingId));
  };
  
  const tryAgainBooking =async () =>{
    let data = localStorage.getItem("data");
    let parsedData = JSON.parse(data)
    dispatch({ type: CONFIRM_BOOKING_STATUS_SUCCESS, payload: parsedData });

   // console.log( JSON.parse(data))
    setTryAgain(false)
    setTryAgainLoading(true);
    setTimeout(() => {
      setTryAgainLoading(false);
    }, 4000);
   // alert(status)
    const response = await dispatch(createBooking(parsedData));
    
    console.log('Booking created successfully:', response?._id);
    if(response?._id)
     setTimeout(() => {
      setBookingId(response?._id)
     }, 20);
  }

  return loading || tryAgainLoading ? (
    <Loader />
  ) : (
    <div style={{  textAlign: "center", padding: 10 }}>
      {/* Map Component */}
      <div>
        <MapComponent
          initialLocation={[
            parseFloat(location.state.coordinates.lat),
            parseFloat(location.state.coordinates.lng),
          ]}
          isEditable={false}
          increaseMapHeight={() => { }}
          searchRider={true}
        />
      </div>

        <div style={{
          backgroundColor: 'white',
          zIndex: 1000,
          position: 'absolute',
          bottom: 0, 
          right:isDesktop?'50%':0,
          left:0,
          padding: 10,
          height: 460,
          display:'flex',
          flexDirection:'column',
          justifyContent:'space-between'
        }}>
          
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <SOS
            text="WhatsApp"
            color={Colors.DARK_GREEN}
            link="https://wa.me/+918595703734"
            Icon={IoLogoWhatsapp}
            width={160}
          />
          <SOS
            text="SOS"
            color={Colors.RED}
            link="tel:+918595703734"
            Icon={FaShieldAlt}
            width={100}
          />
           {/* <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>SOS Options</button>
      <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
        <div className="dropdown-item">
          <SOS
            text="WhatsApp"
            color={Colors.DARK_GREEN}
            link="https://wa.me/+918595703734"
            Icon={IoLogoWhatsapp}
            width={160}
          />
        </div>
        <div className="dropdown-item">
          <SOS
            text="SOS"
            color={Colors.RED}
            link="tel:+918595703734"
            Icon={FaShieldAlt}
            width={100}
          />
        </div>
      </div>
    </div> */}
        </div>

        {service_provider ? (
          <>
            <div style={{ fontSize: 16, padding: 16 }}>
              <div
                style={{
                  color: Colors.DARK_GREEN,
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                Your booking has been confirmed.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 16, marginTop: 10, marginBottom: 10 }}>
                  Start your Service with PIN
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {booking.otp
                    .toString()
                    .split("")
                    .map((digit, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: Colors.WHITE,
                          marginRight: 3,
                          borderRadius: 4,
                          height: 20,
                          width: 20,
                          fontSize: 16,
                        }}
                      >
                        {digit}
                      </div>
                    ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: Colors.WHITE,
                  borderRadius: 16,
                  padding: 10,
                  boxShadow: "0px 0px 16px lightgray",
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 16,
                  }}
                >
                  <div>{service_provider?.name}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://wa.me/+91${service_provider?.contactNumber}`}
                    >
                      <IoLogoWhatsapp color={Colors.DARK_GREEN} size={34} />
                    </a>
                    <a
                      href={`tel:+91${service_provider?.contactNumber}`}
                      style={{
                        marginLeft: 10,
                      }}
                    >
                      <IoMdCall color={Colors.GRAY} size={25} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Btn title="Home" onClick={() => navigate("/")} />
          </>
        ) : (
          <>
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
                         {!tryAgain ?  `Contacting People Nearby...` : `Oops !! No service provider found ! Please try again !`}
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: Colors.MEDIUM_GRAY,
              }}
            >
              {!tryAgain ? 
              <div
                style={{
                  width: `${loadingPercentage}%`,
                  height: "100%",
                  backgroundColor: Colors.GREEN,
                }}
              ></div> :"" }
            </div>
            {!tryAgain ?
            <img
              src={SearchRider}
              style={{
                height: 200,
                width: 200,
                borderRadius: 100,
                // marginBottom: 25
              }}
              alt=""
            /> :"" }
            </div>

            <div style={{}}>
            {/* Tryagain Button */}
            {tryAgain && <Btn
              bgColor={Colors.PRIMARY}
              onClick={tryAgainBooking}
              title="Try Again"
              noMargin={true}
            />}
            {/* Cancel Button */}
            <Btn
              bgColor={Colors.RED}
              onClick={cancelTheBooking}
              title="Cancel"
            />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

