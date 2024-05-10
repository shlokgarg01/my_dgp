import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createBooking } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import LoaderComponent from "../components/Loader";
import Btn from "../components/components/Btn";
import "../styles/CheckoutStyles.css";
import "../styles/ComponentStyles.css";
// import Maps from "../images/google_maps.png";
import Colors from "../utils/Colors";
import { toast } from "react-custom-alert";
import LogoHeader from "../components/components/LogoHeader";
import InputGroup from "../components/components/InputGroup";
import { applyCouponToBooking } from "../actions/CouponActions";
// import MapComponent from "../components/MapComponent";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [params] = useSearchParams();
  const { error, loading, success, booking } = useSelector(
    (state) => state.booking
  );

  const {
    finalPrice,
    discount,
    error: couponError,
    success: couponSuccess,
  } = useSelector((state) => state.coupon);

  const [paymentMode] = useState("Pay using cash");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(params.get("totalPrice"));

  const updatePrices = () => {
    setTotalPrice(finalPrice);
    setCouponDiscount(discount);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (couponError) {
      toast.error(couponError);
      setCouponCode("");
      dispatch(clearErrors());
    }

    if (couponSuccess) {
      toast.success("Coupon Applied");
      updatePrices();
    }

    if (success) {
      navigate("/searchingRider", {
        state: {
          bookingId: booking._id,
          coordinates: { lat: params.get("lat"), lng: params.get("lng") },
        },
      });
    }
    // eslint-disable-next-line
  }, [dispatch, error, success, couponError, couponSuccess]);

  const data = {
    service: params.get("service"),
    subService: params.get("subService"),
    package: params.get("servicePackage"),
    serviceName: params.get("serviceName"),
    subServiceName: params.get("subServiceName"),
    packageName: params.get("packageName"),
    address: params.get("address"),
    coordinates: { lat: params.get("lat"), lng: params.get("lng") },
    date: params.get("date"),
    hours: parseInt(params.get("hours")),
    minutes: parseInt(params.get("minutes")),
    customer: params.get("customer"),
    coupon: couponCode,
    couponDiscount,
    taxPrice: params.get("taxPrice"),
    itemsPrice: params.get("itemsPrice"),
    totalPrice: totalPrice,
    name: params.get("name"),
    email: params.get("email"),
    contactNumber: params.get("contactNumber"),
    paymentInfo: {
      id: `MYDGP_${Date.now()}`,
      status: Enums.PAYMENT_STATUS.PAID,
    },
  };

  const submit = () => {
    dispatch(createBooking(data));
  };

  const applyCoupon = () => {
    dispatch(applyCouponToBooking(couponCode, params.get("totalPrice")));
  };

  // const Details = ({ heading, data, isTop, isBottom, subHeading, showTax }) => (
  //   <div
  //     className="checkoutDetailsContainer"
  //     style={{
  //       borderTopRightRadius: isTop ? 7 : 0,
  //       borderTopLeftRadius: isTop ? 7 : 0,
  //       borderBottomLeftRadius: isBottom ? 7 : 0,
  //       borderBottomRightRadius: isBottom ? 7 : 0,
  //     }}
  //   >
  //     <div className="checkoutDetailsHeading">{heading}</div>
  //     {subHeading ? (
  //       <div>
  //         <div className="checkoutDetails">
  //           {data}
  //           {showTax ? (
  //             <>
  //               <div>₹ {params.get("taxPrice")}</div>
  //               <div
  //                 style={{
  //                   backgroundColor: Colors.BLACK,
  //                   height: 1,
  //                   marginTop: 4,
  //                   marginBottom: 4,
  //                 }}
  //               />
  //               <div>
  //                 ₹{" "}
  //                 {parseInt(params.get("taxPrice")) +
  //                   parseInt(params.get("itemsPrice"))}
  //               </div>
  //             </>
  //           ) : null}
  //         </div>
  //         <div id="checkoutDetailsSubHeading">{subHeading}</div>
  //       </div>
  //     ) : (
  //       <div className="checkoutDetails">
  //         <div>{data}</div>
  //       </div>
  //     )}
  //   </div>
  // );

  const Header1 = ({ data }) => (
    <div
      style={{
        marginTop: 13,
        textAlign: "center",
        borderRadius: 100,
        border: `1px solid ${Colors.MEDIUM_GRAY}`,
        color: Colors.MEDIUM_GRAY,
        fontSize: 19,
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      {data}
    </div>
  );

  const SubHeading = ({ heading, data }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 4,
        fontSize: 18,
      }}
    >
      <div style={{ color: Colors.GRAY, fontWeight: 500 }}>{heading}</div>
      <div style={{ fontWeight: "bold" }}>{data}</div>
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

            {/* <div
              style={{
                height: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MapComponent
                initialLocation={{
                  lat: params.get("lat"),
                  lng: params.get("lng"),
                }}
                isEditable={false}
                style={{ height: 200, width: 200 }}
              />
            </div> */}

            <div
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: 16,
                padding: 10,
                boxShadow: "0px 0px 16px lightgray",
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
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 17 }}>
                  <div>{data.name}</div>
                  <div style={{ color: Colors.GRAY }}>{data.contactNumber}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>
                  ₹
                  {totalPrice}
                </div>
              </div>

              <Header1
                data={`${data.serviceName} ${data.packageName}, ${data.subServiceName}`}
              />
              <Header1 data={data.date.slice(0, 10)} />
            </div>

            <div
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: 16,
                padding: 10,
                boxShadow: "0px 0px 16px lightgray",
                marginTop: 16,
                textAlign: "center",
                fontSize: 17,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {data.address}
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
              <SubHeading data={data.hours} heading="Total Hours" />
              <SubHeading data={`₹ ${data.itemsPrice}`} heading="Sub Total" />
              <SubHeading
                data={`₹ ${data.taxPrice}`}
                heading="Service Charge"
              />
              <SubHeading
                data={`₹ ${parseInt(data.totalPrice) + couponDiscount}`}
                heading="Total Price"
              />
              {couponDiscount > 0 ? (
                <>
                  <SubHeading
                    data={`₹ ${discount}`}
                    heading="Coupon Discount"
                  />
                  <SubHeading data={`₹ ${totalPrice}`} heading="Final Price" />
                </>
              ) : null}
            </div>

            <div
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: 16,
                padding: 10,
                boxShadow: "0px 0px 16px lightgray",
                marginTop: 16,
                textAlign: "center",
                fontSize: 17,
                paddingLeft: 10,
                paddingRight: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InputGroup
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                bgColor={Colors.LIGHT_GRAY}
                noMargin
              />
              <Btn
                smallButton
                onClick={applyCoupon}
                title="Apply"
                btnHeight={34}
                noMargin
                leftMargin
              />
            </div>

            <div
              id="checkoutDetailsSubHeading"
              style={{ paddingLeft: 10, paddingRight: 10, marginTop: 4 }}
            >
              <b>Note - </b>We will provide you all the raw photos & videos
              within 24 hrs.
            </div>

            {/* <div id="checkoutDetailsParentContainer">
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
            </div> */}
          </div>

          {/* Payment Mode Radio Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 16,
              marginTop: 10,
            }}
          >
            <input
              style={{ accentColor: Colors.PRIMARY }}
              type="radio"
              id="paymentMode"
              value={paymentMode}
              readOnly
              checked={paymentMode === "Pay using cash"}
            />
            <label
              style={{ fontSize: 18, marginLeft: 7 }}
              htmlFor="paymentMode"
            >
              {paymentMode}
            </label>
          </div>
          <Btn onClick={submit} title="Submit & Proceed" />
        </div>
      )}
    </div>
  );
}
