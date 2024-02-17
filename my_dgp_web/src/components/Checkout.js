import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createBooking } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import Loader from "./Loader";
import LogoHeader from "./components/LogoHeader";
import Btn from "./components/Btn";
import "../styles/CheckoutStyles.css";
import "../styles/ComponentStyles.css";
import Maps from "../images/google_maps.png";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, success } = useSelector((state) => state.booking);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert("Your booking has been created successfully!");
      navigate("/");
    }
  }, [dispatch, error, success]);

  let [params] = useSearchParams();
  const data = {
    service: params.get("service"),
    serviceName: params.get("serviceName"),
    address: params.get("address"),
    date: params.get("date"),
    hours: parseInt(params.get("hours")),
    customer: "65769bb6f664dbb6722e90ba",
    taxPrice: params.get("taxPrice"),
    itemsPrice: params.get("itemsPrice"),
    totalPrice: params.get("totalPrice"),
    name: params.get("name"),
    email: params.get("email"),
    contactNumber: params.get("contactNumber"),
    paymentInfo: {
      id: "234345634klmlkml",
      status: Enums.PAYMENT_STATUS.PAID,
    },
  };

  const submit = () => {
    dispatch(createBooking(data));
  };

  const Details = ({ heading, data, isTop, isBottom, subHeading }) => (
    <div
      className="checkoutDetailsContainer"
      style={{
        borderTopRightRadius: isTop ? 7 : 0,
        borderTopLeftRadius: isTop ? 7 : 0,
        borderBottomLeftRadius: isBottom ? 7 : 0,
        borderBottomRightRadius: isBottom ? 7 : 0,
      }}
    >
      <div className="checkoutDetailsHeading">{heading}</div>
      {subHeading ? (
        <div>
          <div className="checkoutDetails">{data}</div>
          <div id="checkoutDetailsSubHeading">{subHeading}</div>
        </div>
      ) : (
        <div className="checkoutDetails">{data}</div>
      )}
    </div>
  );

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <div className="subContainer">
          <div>
            <LogoHeader />
            <div style={{ width: "90%" }}>
              {/* @TODO - Add static location on maps here */}
              <img src={Maps} style={{  width: "110%" }} />
            </div>

            <div id="checkoutDetailsParentContainer">
              <Details isTop={true} heading="Service" data={data.serviceName} />
              <Details
                isBottom={true}
                heading="Date"
                data={`${data.date.slice(0, 10)}, for ${data.hours} ${
                  data.hours === 1 ? "hr" : "hrs"
                }`}
              />
            </div>

            <div id="checkoutDetailsParentContainer">
              <Details
                isTop={true}
                heading="Location"
                data={params.get("address")}
              />
              <Details
                heading="Customer"
                data={`${data.name}, ${data.contactNumber}`}
              />
              <Details
                isBottom={true}
                heading="Fare"
                data={`₹ ${data.totalPrice}`}
                subHeading="Total Fare"
              />
            </div>
          </div>
          <Btn onClick={submit} title="Submit & Proceed" />
        </div>
      )}
    </div>
  );
}
