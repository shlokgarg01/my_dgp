import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Colors from "../utils/Colors";
import SearchRider from "../images/search_rider.png";
import { useDispatch, useSelector } from "react-redux";
import { confirmBookingStatus } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import { toast } from "react-custom-alert";
import Btn from "../components/components/Btn";
import MapComponent from "../components/MapComponent";
import { IoMdCall } from "react-icons/io";
import { FaShieldAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

export default function SearchingRider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(10);
  const { status, service_provider, booking } = useSelector(
    (state) => state.confirmedBooking
  );

  useEffect(() => {
    let fetchDataTimeout;
    const fetchData = async () => {
      try {
        dispatch(confirmBookingStatus(location.state.bookingId));

        fetchDataTimeout = setTimeout(() => {
          fetchData();
        }, 1500);

        if (status === Enums.BOOKING_STATUS.ACCEPTED) {
          clearTimeout(fetchDataTimeout);
          // setTimeout(() => {
          toast.success("Booking Confirmed");
          //   navigate("/");
          // }, 2000);
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

    return () => {
      clearInterval(interval);
      clearTimeout(fetchDataTimeout);
    };
  }, [dispatch, location.state.bookingId, status]);

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

  const cancelBooking = () => {
    console.log("CANCEL TRIGGERED");
    // TODO - call redux to cancel booking
  };

  return (
    <div style={{ height: "100%", textAlign: "center" }}>
      {/* Map Component */}
      <div
        style={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MapComponent
          initialLocation={{
            lat: location.state.coordinates.lat,
            lng: location.state.coordinates.lng,
          }}
          isEditable={false}
        />
      </div>

      {/* SOS Buttons */}
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
          link="https://api.whatsapp.com/send?phone=8595703734"
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
                <a
                  href={`tel:+91${service_provider?.contactNumber}`}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 100,
                    border: `1px solid ${Colors.MEDIUM_GRAY}`,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    textDecoration: "none",
                  }}
                >
                  <IoMdCall color={Colors.GRAY} size={25} />
                </a>
              </div>
            </div>
          </div>
          <Btn title="Go Back" onClick={() => navigate("/")} />
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Contacting People Nearby...
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: Colors.MEDIUM_GRAY,
            }}
          >
            <div
              style={{
                width: `${loadingPercentage}%`,
                height: "100%",
                backgroundColor: Colors.GREEN,
              }}
            ></div>
          </div>

          <img
            src={SearchRider}
            style={{
              height: 200,
              width: 200,
              borderRadius: 100,
              marginBottom: 25
            }}
            alt=""
          />

          {/* Cancel Button */}
          <Btn
            bgColor={Colors.RED}
            onClick={cancelBooking}
            title="CANCEL BOOKING"
          />
        </>
      )}
    </div>
  );
}
