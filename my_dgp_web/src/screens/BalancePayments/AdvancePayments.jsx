import React, { useEffect, useState } from "react";
import "./BalancePayments.css";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmBookingStatus } from "../../actions/BookingActions";
import axios from "axios";
import { BASE_URL } from "../../config/Axios";
import { toast } from "react-custom-alert";
import { RAZORPAY_KEY_ID } from "../../config/Config";
import Colors from "../../utils/Colors";

// e.g.http://localhost:3000/advance-payment?id=000788
const AdvancePayments = () => {
  const [selectedPayment, setSelectedPayment] = useState(true);
  const location = useLocation(); //get url
  const [bookingId,setBookingId] = useState();
  const dispatch = useDispatch();
  const [isPaymentDone,setPaymentDone] = useState(false);


  const { status, service_provider, booking } = useSelector(
    (state) => state.confirmedBooking//get booking from id
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bookingIdFromQuery = queryParams.get("id");

    if(bookingIdFromQuery){
      setBookingId(bookingIdFromQuery)
    }
  }, [location]); // Run this effect whenever the location changes

  useEffect(() => {
    dispatch(confirmBookingStatus(bookingId)); //get booking from id
  }, [bookingId])

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
        amount: Math.round(booking?.totalPrice/2),
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
          amount: Math.round(booking?.totalPrice/2),
          status:'PARTIAL_PAID'
        };

        let paymentResponse;
        try {
          paymentResponse = await axios.post(
            `${BASE_URL}/api/v1/bookings/payment/success`,
            res
          );
          if (paymentResponse.data.success)
            
            toast.success('Payment Successful');
            setPaymentDone(true);
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

  const handlePayment = () => {
    if (selectedPayment) {
      displayRazorpay()
        } else {
      alert("Please select the payment option.");
    }
  };

  return (
    <div className="container">
      <div className="avatar-container">
        <img
          className="profile-pic"
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="Generic Male Avatar"
        />
      </div>

      <div className="status-tag">
        <span className="check-icon">✔</span> Rider Reached
      </div>

      <div className="warning">Pay Advance Amount to start booking</div>

      <div className="amount-section">
        <h2>Advance Amount to pay</h2>
        {/* <h3>Aakash Saklani</h3> */}

        <div className="amount">
        ₹{Math.round(booking?.totalPrice/2)}
        </div>
      </div>
      <div className="note">
        <strong>NOTE:</strong> Booking Start OTP will not be generated without advance payment.
      </div>

      <div className="payment-method">
        <div
          className={`payment-option ${selectedPayment ? "selected" : ""}`}
          onClick={() => setSelectedPayment(true)}
        >
          <input
            type="radio"
            id="single-payment"
            name="payment"
            value="Net Banking / UPI / Credit / Debit Cards"
            checked={selectedPayment}
            onChange={() => setSelectedPayment(true)}
          />
          <label htmlFor="single-payment">
          Net Banking / UPI / Credit / Debit Cards
          </label>
        </div>
      </div>

      <button className="btn-pay" onClick={handlePayment}>
        PAY NOW
      </button>
    </div>
  );
};

export default AdvancePayments