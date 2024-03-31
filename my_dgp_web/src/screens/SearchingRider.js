import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Maps from "../images/google_maps.png";
import Colors from "../utils/Colors";
import SearchRider from "../images/search_rider.png";

export default function SearchingRider() {
  const navigate = useNavigate();
  let [params] = useSearchParams();
  const [loadingPercentage, setLoadingPercentage] = useState(10);

  // updating the counter
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setLoadingPercentage((prevPercentage) => {
          const newPercentage = prevPercentage + 1;
          if (newPercentage === 100) {
            clearInterval(interval);
            setTimeout(() => {
              setLoadingPercentage(0);
              setTimeout(() => {
                const loadingInterval = setInterval(() => {
                  setLoadingPercentage(
                    (prevPercentage) => (prevPercentage + 1) % 101
                  );
                }, 50); // Update loading percentage every 10 milliseconds
                setTimeout(() => {
                  clearInterval(loadingInterval);
                  navigate({
                    pathname: "/checkout",
                    search: createSearchParams({
                      service: params.get("service"),
                      serviceName: params.get("serviceName"),
                      address: params.get("address"),
                      date: params.get("date"),
                      hours: params.get("hours"),
                      customer: params.get("customer"),
                      taxPrice: params.get("taxPrice"),
                      itemsPrice: params.get("itemsPrice"),
                      totalPrice: params.get("totalPrice"),
                      name: params.get("name"),
                      email: params.get("email"),
                      contactNumber: params.get("contactNumber"),
                    }).toString(),
                  });
                }, 4000);
              }, 0);
            }, 0);
          }
          return newPercentage % 101;
        });
      }, 50); // Update loading percentage every 10 milliseconds
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
