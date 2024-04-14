import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Maps from "../images/google_maps.png";
import Colors from "../utils/Colors";
import SearchRider from "../images/search_rider.png";
import { useDispatch, useSelector } from "react-redux";
import { confirmBookingStatus } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import { toast } from "react-custom-alert";
import Btn from "../components/components/Btn";

export default function SearchingRider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(10);
  const { status, service_provider } = useSelector(
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

  return (
    <div style={{ height: "100%", textAlign: "center" }}>
      <div style={{ width: "100%", height: "55%" }}>
        <img src={Maps} style={{ width: "100%", height: "100%" }} alt="" />
      </div>

      {service_provider ? (
        <>
          <div style={{ fontSize: 19, padding: 16 }}>
            <div>
              Thank you for trusting MyDGP ❤️ Your booking has been confirmed.
            </div>
            <div>
              Your service provider is <b>{service_provider?.name}. </b>You will
              receive other details over your email shortly
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
            }}
            alt=""
          />
        </>
      )}
    </div>
  );
}
