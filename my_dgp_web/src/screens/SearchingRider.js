import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Maps from "../images/google_maps.png";
import Colors from "../utils/Colors";
import SearchRider from "../images/search_rider.png";
import { useDispatch, useSelector } from "react-redux";
import { confirmBookingStatus } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import { toast } from "react-custom-alert";

export default function SearchingRider() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(10);
  const { error, loading, booking, status, service_provider } = useSelector(state => state.confirmedBooking)
  // console.info("-------------------------", booking, status, service_provider)

  useEffect(() => {
    // Simulated API call
    const fetchData = async () => {
      try {
        // Make your API call here
        // dispatch(confirmBookingStatus(location.state.bookingId))
        console.log("BOOKING ID - ", location.state.bookingId, status)

        // if (status === Enums.BOOKING_STATUS.ACCEPTED) {
          // navigate to home  screen here & show the success popup here
          // console.log("Booking Accepted - ", booking, status, service_provider)
          setTimeout(() => {
            console.log("YOU CAN NAVIGATE NOW");
            toast.success("Booking confirmed.")
            navigate("/")
            // Navigate to another screen, you can use router or any navigation method here
          }, 4000);
        // } else {
          // console.log("Booking still in placed status - ", booking, status, service_provider)
        //   setTimeout(fetchData, 1500) // call the API  every 1.5 seconds
        // }
        // For demonstration, I'm using a setTimeout to simulate a delay
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        // If API call fails, handle the error
        console.error("Error fetching data:", error);
      }
    };

    // Start fetching data when the component mounts
    fetchData();

    const interval = setInterval(() => {
      setLoadingPercentage((prevPercentage) => {
        return (prevPercentage + 1) % 101;
      });
    }, 25);

    // Stop updating loading percentage when API call is successful
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div style={{ height: "100%", textAlign: "center" }}>
      <div style={{ width: "100%", height: "55%" }}>
        <img src={Maps} style={{ width: "100%", height: "100%" }} alt="" />
      </div>

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
    </div>
  );
}
