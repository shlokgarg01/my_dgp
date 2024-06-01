import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createBooking } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import LoaderComponent from "../components/Loader";
import Btn from "../components/components/Btn";
import "../styles/CheckoutStyles.css";
import "../styles/ComponentStyles.css";
import Colors from "../utils/Colors";
import { toast } from "react-custom-alert";
import LogoHeader from "../components/components/LogoHeader";
import InputGroup from "../components/components/InputGroup";
import { applyCouponToBooking } from "../actions/CouponActions";
import axios from "axios";
import { BASE_URL } from "../config/Axios";
import { RAZORPAY_KEY_ID } from "../config/Config";
import { clearData } from "../actions/DataActions";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [params] = useSearchParams();
  const {savedData} = useSelector(state => state.savedData)
  const { error, loading, success, booking } = useSelector(
    (state) => state.booking
  );

  const {
    finalPrice,
    discount,
    error: couponError,
    success: couponSuccess,
  } = useSelector((state) => state.coupon);

  const [paymentMode, setPaymentMode] = useState(Enums.PAYMENT_MODES.ONLINE);
  const [couponCode, setCouponCode] = useState(savedData.couponCode || "");
  const [couponDiscount, setCouponDiscount] = useState(savedData.couponDiscount || 0);
  const [totalPrice, setTotalPrice] = useState(savedData.totalPrice || params.get("totalPrice"));

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
      dispatch(clearData())
      navigate("/searchingRider", {
        state: {
          bookingId: booking._id,
          coordinates: { lat: params.get("lat"), lng: params.get("lng") },
        },
      });
    }
    // eslint-disable-next-line
  }, [dispatch, error, success, couponError, couponSuccess]);

  const data = (paymentId = null, paymentStatus = null) => ({
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
      id: paymentId,
      status: paymentStatus,
    },
  });

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
        amount: data().totalPrice,
        service: data().service,
        subService: data().subService,
        package: data().package,
        date: data().date,
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
      name: data().name,
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const res = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        let paymentResponse;
        try {
          paymentResponse = await axios.post(
            `${BASE_URL}/api/v1/bookings/payment/success`,
            res
          );
          if (paymentResponse.data.success)
            dispatch(
              createBooking(
                data(response.razorpay_payment_id, Enums.PAYMENT_STATUS.PAID)
              )
            );
        } catch (error) {
          console.error('Error in payment success API - ', error.response.data)
          toast.error(error.response.data.message);
        }
      },
      prefill: {
        name: data().name,
        email: data().email,
        contact: data().contactNumber,
      },
      notes: {
        address: data().address,
      },
      theme: {
        color: Colors.PRIMARY,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const submit = () => {
    paymentMode === Enums.PAYMENT_MODES.ONLINE
      ? displayRazorpay()
      : dispatch(
          createBooking(
            data(`MYDGP_${Date.now()}`, Enums.PAYMENT_STATUS.NOT_PAID)
          )
        );
  };

  const applyCoupon = () => {
    dispatch(applyCouponToBooking(couponCode, params.get("totalPrice")));
  };

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
                  <div>{data().name}</div>
                  <div style={{ color: Colors.GRAY }}>
                    {data().contactNumber}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>
                  ₹{totalPrice}
                </div>
              </div>

              <Header1
                data={`${data().serviceName} ${data().packageName}, ${
                  data().subServiceName
                }`}
              />
              <Header1 data={data().date.slice(0, 10)} />
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
              {data().address}
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
              <SubHeading data={data().hours} heading="Total Hours" />
              <SubHeading data={`₹ ${data().itemsPrice}`} heading="Sub Total" />
              <SubHeading
                data={`₹ ${data().taxPrice}`}
                heading="Service Charge"
              />
              <SubHeading
                data={`₹ ${parseInt(data().totalPrice) + couponDiscount}`}
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
              id="paymentModeCash"
              value={Enums.PAYMENT_MODES.CASH}
              onChange={(e) => setPaymentMode(e.target.value)}
              checked={paymentMode === Enums.PAYMENT_MODES.CASH}
            />
            <label
              style={{ fontSize: 18, marginLeft: 7 }}
              htmlFor="paymentModeCash"
            >
              {Enums.PAYMENT_MODES.CASH}
            </label>
          </div>
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
              id="paymentModeOnline"
              value={Enums.PAYMENT_MODES.ONLINE}
              onChange={(e) => setPaymentMode(e.target.value)}
              checked={paymentMode === Enums.PAYMENT_MODES.ONLINE}
            />
            <label
              style={{ fontSize: 18, marginLeft: 7 }}
              htmlFor="paymentModeOnline"
            >
              {Enums.PAYMENT_MODES.ONLINE}
            </label>
          </div>
          <Btn onClick={submit} title="Submit & Proceed" />
        </div>
      )}
    </div>
  );
}
