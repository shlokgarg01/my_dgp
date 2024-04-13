import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createBooking } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import LoaderComponent from "../components/Loader";
import Btn from "../components/components/Btn";
import "../styles/CheckoutStyles.css";
import "../styles/ComponentStyles.css";
import Maps from "../images/google_maps.png";
import Colors from "../utils/Colors";
import { toast } from "react-custom-alert";
import LogoHeader from '../components/components/LogoHeader'

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState("Pay using cash");
  const { error, loading, success, booking } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      navigate("/searchingRider", { state: { bookingId: booking._id } });
    }
    // eslint-disable-next-line
  }, [dispatch, error, success]);

  let [params] = useSearchParams();
  const data = {
    service: params.get("service"),
    serviceName: params.get("serviceName"),
    address: params.get("address"),
    coordinates: { lat: params.get("lat"), lng: params.get("lng") },
    date: params.get("date"),
    hours: parseInt(params.get("hours")),
    customer: params.get('customer'),
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

  const Details = ({ heading, data, isTop, isBottom, subHeading, showTax }) => (
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
          <div className="checkoutDetails">
            {data}
            {showTax ? (
              <>
                <div>₹ {params.get("taxPrice")}</div>
                <div
                  style={{
                    backgroundColor: Colors.BLACK,
                    height: 1,
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                />
                <div>
                  ₹{" "}
                  {parseInt(params.get("taxPrice")) +
                    parseInt(params.get("itemsPrice"))}
                </div>
              </>
            ) : null}
          </div>
          <div id="checkoutDetailsSubHeading">{subHeading}</div>
        </div>
      ) : (
        <div className="checkoutDetails">
          <div>{data}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: 0 }}>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div
          className="subContainer"
          style={{ padding: "25px 13px 13px 13px" }}
        >
          <div>
            <LogoHeader showLogo={false} />
            <div style={{ width: "90%" }}>
              <img src={Maps} style={{ width: "110%" }} alt="" />
            </div>

            <div id="checkoutDetailsParentContainer">
              <Details
                isTop={true}
                heading="Service"
                data={data.serviceName}
                subHeading={`Unlimited ${
                  params.get("serviceName").split(" ")[0] === "Photography"
                    ? "photos"
                    : params.get("serviceName").split(" ")[0] === "Videography"
                    ? "videos"
                    : "photos & videos"
                } in between the timings`}
              />
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
                data={`₹ ${data.itemsPrice}`}
                subHeading="Total Fare"
                showTax={true}
              />
            </div>
            <div
              id="checkoutDetailsSubHeading"
              style={{ paddingLeft: 10, paddingRight: 10 }}
            >
              <b>Note - </b>We will provide you all the raw photos & videos
              within 24 hrs.
            </div>
          </div>

          {/* Payment Mode Radio Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 16,
              marginTop: 10
            }}
          >
            <input
            style={{accentColor: Colors.PRIMARY}}
              type="radio"
              id="paymentMode"
              value={paymentMode}
              readOnly
              checked={paymentMode === "Pay using cash"}
            />
            <label style={{fontSize: 18, marginLeft: 7}} htmlFor="paymentMode">{paymentMode}</label>
          </div>
          <Btn onClick={submit} title="Submit & Proceed" />
        </div>
      )}
    </div>
  );
}
