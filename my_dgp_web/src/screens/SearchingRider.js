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
import axios from 'axios';
import { BASE_URL } from "../config/Axios";
import { RAZORPAY_KEY_ID } from "../config/Config";
import { sendAdvanceMsg, sendAdvanceStartOtpMsg, sendBalanceMsg } from "../utils/whatsappMsg";

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
  const [tryAgainLoading, setTryAgainLoading] = useState(false);
  const [bookingId, setBookingId] = useState("")
  const [APIbookingId, setAPIBookingId] = useState("")
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isPaymentDone, setPaymentDone] = useState(false);
  const contactNumber = localStorage.getItem('userNumber')

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
        if (bookingId.length) {
          dispatch(confirmBookingStatus(bookingId));
          setAPIBookingId(bookingId)
        }
        else {
          dispatch(confirmBookingStatus(location.state.bookingId));
          setAPIBookingId(location.state.bookingId)
        }

        fetchDataTimeout = setTimeout(() => {
          fetchData();
        }, 1500);

        if (status === Enums.BOOKING_STATUS.ACCEPTED) {
          clearTimeout(fetchDataTimeout);
          toast.success("Booking Confirmed");
          // const data =  localStorage.removeItem("data")
          const feedbackData = {
            customerId:booking?.customer,
            bookingId:booking?._id,
            booking:booking,
            serviceProvider:service_provider
          }
          localStorage.setItem("feedback",JSON.stringify(feedbackData));
          sendAdvanceMsg(service_provider?.name, Math.round(booking?.totalPrice / 2), `${window.location.origin}/payment/${booking?._id}`, contactNumber)
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


    if (isCancelled || status === Enums.BOOKING_STATUS.CANCELLED) {
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
      if (bookingId.length) {
        if (bookingId == APIbookingId)
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

  const callUpdatePaymentApi = async (bookingId, amount, transactionId) => {
    const apiUrl = "http://localhost/api/v1/bookings/payment/update";
    const requestData = {
      bookingId: bookingId,
      paymentAmount: amount,
      transactionId: transactionId
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      // console.log(data);
    } catch (error) {
      console.error("Error:", error);
      // setResponse({ error: "An error occurred while updating payment." });
    }
  };


  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    // setPaymentLoading(true)
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    let result;
    try {
      result = await axios.post(`${BASE_URL}/api/v1/bookings/createOrder`, {
        amount: Math.round(booking?.totalPrice / 2),
        service: booking?.service,
        subService: booking?.subService,
        package: booking?.package,
        date: booking?.date,
      });
    } catch (e) {
      console.error("Error in Create Order API - ", e.response.data)
      toast.error(e.response.data.message);
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.order;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount.toString(),
      currency: currency,
      name: booking?.name,
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const res = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          bookingId: booking?._id,
          amount: Math.round(booking?.totalPrice / 2),
          status: 'PARTIAL_PAID'
        };

        let paymentResponse;
        try {
          paymentResponse = await axios.post(
            `${BASE_URL}/api/v1/bookings/payment/success`,
            res
          );
          if (paymentResponse.data.success)
            // dispatch(
            //   createBooking(
            //     data(response.razorpay_payment_id, Enums.PAYMENT_STATUS.PAID)
            //   )
            // );
            // callUpdatePaymentApi(booking?._id, Math.round(booking?.totalPrice/2),response.razorpay_payment_id)
            toast.success('Payment Successful');
          setPaymentDone(true);
          sendAdvanceStartOtpMsg(contactNumber,booking?.otp)
        } catch (error) {
          console.error('Error in payment success API - ', error.response.data)
          toast.error(error.response.data.message);
        }
      },
      prefill: {
        name: booking?.name,
        email: booking?.email,
        contact: booking?.contactNumber,
      },
      notes: {
        address: booking?.address,
      },
      theme: {
        color: Colors.PRIMARY,
      },
    };

    // setPaymentLoading(false);

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const tryAgainBooking = async () => {
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
    if (response?._id)
      setTimeout(() => {
        setBookingId(response?._id)
      }, 20);
  }

  const OtpView = () => {
    return (
      isPaymentDone ?
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 16, marginTop: 10, marginBottom: 10 }}>
            Start your booking with OTP:
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
                    backgroundColor: Colors.LIGHT_GRAY,
                    marginRight: 3,
                    borderRadius: 4,
                    height: 24,
                    width: 24,
                    fontSize: 20,
                  }}
                >
                  {digit}
                </div>
              ))}
          </div>
        </div> :
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            height: '20vh',
          }}
        >
          <div style={{ fontSize: 16 }}>
            Please Pay Advance Booking amount to get start Booking OTP
          </div>
          <div
            style={{
              width: '100%'
            }}
          >
            <Btn
              bgColor={Colors.PRIMARY}
              onClick={() => { displayRazorpay() }}
              title="Pay Now"
            />
          </div>
        </div>
    )
  }

  return loading || tryAgainLoading ? (
    <Loader />
  ) : (
    <div style={{ textAlign: "center", padding: 10 }}>
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
        right: isDesktop ? '50%' : 0,
        left: 0,
        padding: 10,
        height: 460,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
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
              <OtpView />
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
                {!tryAgain ? `Contacting People Nearby...` : `Oops !! No service provider found ! Please try again !`}
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
                  ></div> : ""}
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
                /> : ""}
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

