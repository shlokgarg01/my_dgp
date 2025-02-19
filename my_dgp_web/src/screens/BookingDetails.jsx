import React, { useEffect, useState } from 'react'
import HamburgerMenu from '../components/components/HamburgerMenu';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking, confirmBookingStatus } from '../actions/BookingActions';
import Colors from '../utils/Colors';
import { IoLogoWhatsapp, IoMdCall } from 'react-icons/io';
import Btn from '../components/components/Btn';
import axios from 'axios';
import { toast } from 'react-custom-alert';
import { BASE_URL } from '../config/Axios';
import { RAZORPAY_KEY_ID } from '../config/Config';
import { sendAdvanceStartOtpMsg } from '../utils/whatsappMsg';
import Enums, { PAYMENT_STATUS } from '../utils/Enums';

const BookingDetails = () => {
  const location = useLocation(); //get url
  const dispatch = useDispatch();

  const { bookingId } = location.state || {}; // Access the bookingId from state
  const { status, service_provider, booking } = useSelector(
    (state) => state.confirmedBooking //get booking from id
  );
  

  useEffect(() => {
    dispatch(confirmBookingStatus(bookingId)); //get booking from id
  }, [bookingId]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
      day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `${day}${suffix} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
  }

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString([], options);
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
      day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const options = { month: 'short', year: 'numeric' };
    const formattedDate = `${day}${suffix} ${date.toLocaleString('default', options)}`;
    const formattedTime = formatTime(dateString);
    return `${formattedDate}, ${formattedTime}`;
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime); // Convert startTime to Date object
    const end = new Date(endTime); // Convert endTime to Date object
    const durationInMinutes = Math.floor((end - start) / 60000); // Convert milliseconds to minutes
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours} hr. ${minutes} min.`;
  }

  const handleCancelBooking = async () => {
    await dispatch(cancelBooking(bookingId));
    dispatch(confirmBookingStatus(bookingId));
  };

  const handleAdvancePayment = () => {
    displayRazorpay(Math.round(booking?.totalPrice / 2), "PARTIAL_PAID");
  };

  const handleBalancePayment = () => {
    displayRazorpay(Math.round(booking?.paymentInfo?.balancePayment), PAYMENT_STATUS.PAID);
  }

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

  const displayRazorpay = async (amt,paymentStatus) => {
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
        amount:amt,
        service: booking?.service,
        subService: booking?.subService,
        package: booking?.package,
        date: booking?.date,
      });
    } catch (e) {
      console.error("Error in Create Order API - ", e.response.data);
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
      description: "Transaction",
      order_id: order_id,
      handler: async function (response) {
        const res = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          bookingId: booking?._id,
          amount: amt,
          status: paymentStatus,
        };

        let paymentResponse;
        try {
          paymentResponse = await axios.post(
            `${BASE_URL}/api/v1/bookings/payment/success`,
            res
          );
          if (paymentResponse.data.success) toast.success("Payment Successful");
          // setPaymentDone(true);
          if(paymentStatus==="PARTIAL_PAID"){
            sendAdvanceStartOtpMsg({
              contactNumber: localStorage.getItem("userNumber"),
              otp: booking?.otp
            });
          }
          dispatch(confirmBookingStatus(bookingId));
          
        } catch (error) {
          console.error("Error in payment success API - ", error.response.data);
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

  const renderRiderDetails = () => {
    return (
      <div style={{ fontSize: 16 }}>
        <div
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 16,
            padding: 10,
            boxShadow: "0px 0px 10px lightgray",
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
      </div>
    );
  };

  const renderPaymentRow = (label, value) => (
    <div style={styles.row}>
      <p style={styles.leftAlign}>{label}</p>
      <p style={styles.rightAlign}>₹{value}</p>
    </div>
  );

  return (
    <>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: 10 }} >
        <div><HamburgerMenu /></div>
        <div style={{ textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#4CAF50' }}>BOOKING {booking?.status}</div>
      </div>
      <div style={styles.container}>
        <div style={styles.bookingDetails}>
          <h3>Booking Details</h3>
          <p>Booking ID: {bookingId}</p>
          <p>Booked On: {formatDate(booking?.date)}</p>
          <h3>Package</h3>
          <p>{booking?.service?.name} for {booking?.subService?.name}</p>
          <p>Duration: {booking?.hours > 0 && `${booking?.hours} hr. `}{booking?.minutes > 0 && `${booking?.minutes} min.`}</p>
        </div>
        {booking?.status !== "COMPLETED" && booking?.status !== "CANCELLED" && <div style={styles.bookingDetails}>
          <h3>Service Provider</h3>
          {renderRiderDetails()}
        </div>}
        {booking?.status === "ACCEPTED" && <div style={styles.bookingDetails}>
          <h3>Booking OTP</h3>
          {booking?.paymentInfo?.status === "NOT_PAID" ? <div>Please Pay Advance to get OTP</div> : <div>{booking?.otp}</div>}

        </div>}

        {booking?.status === 'COMPLETED' && <div style={styles.bookingDetails}>
          <h3>Service Details</h3>
          <p>Start Time: {formatDateTime(booking?.startTime)}</p>
          <p>End Time: {formatDateTime(booking?.endTime)}</p>
          <p>Total Duration: {calculateDuration(booking?.startTime, booking?.endTime)}</p>
          <p>Overtime: {booking?.hours > 0 && `${booking?.hours} hr. `}{booking?.minutes > 0 && `${booking?.minutes} min.`}</p>
        </div>}

        <div style={styles.paymentSummary}>
          <h3 style={styles.leftAlign}>Payment Summary</h3>
          {renderPaymentRow('Subtotal', booking?.totalPrice)}
          {renderPaymentRow('Convenience Charges', booking?.taxPrice)}
          {booking?.overtimeDetails?.overtimePrice > 0 && renderPaymentRow('Overtime Charges', booking?.overtimeDetails?.overtimePrice)}
          {booking?.paymentInfo?.paymentReceived > 0 && renderPaymentRow('Payment Received', booking?.paymentInfo?.paymentReceived)}
          <hr style={styles.divider} />
          {booking?.paymentInfo?.paymentReceived < 1 && booking?.status != Enums.BOOKING_STATUS.CANCELLED ?
            <div style={styles.row}>
              <p style={{ ...styles.leftAlign, fontWeight: 'bold' }}>Advance Payment</p>
              <p style={{ ...styles.rightAlign, fontWeight: 'bold' }}>₹{(booking?.totalPrice + booking?.taxPrice) / 2}</p>
            </div>
            :  booking?.status != Enums.BOOKING_STATUS.CANCELLED && <div style={styles.row}>
              <p style={{ ...styles.leftAlign, fontWeight: 'bold' }}>Balance Payment</p>
              <p style={{ ...styles.rightAlign, fontWeight: 'bold' }}>₹{booking?.paymentInfo?.balancePayment}</p>
            </div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'sticky', left: 0, right: 0, bottom: 10, backgroundColor: 'white' }}>
          {booking?.status === "ACCEPTED" && 
          <Btn styles={styles.button} onClick={handleCancelBooking}
              bgColor={Colors.RED}
              title="Cancel Booking"
            /> }
          {booking?.paymentInfo?.paymentReceived < 1 && booking?.status != Enums.BOOKING_STATUS.CANCELLED ?
            <Btn styles={styles.button} onClick={handleAdvancePayment}
              bgColor={Colors.PRIMARY}
              title="Pay advance"
            /> :
            booking?.paymentInfo?.status != "PAID" && booking?.status != Enums.BOOKING_STATUS.CANCELLED && (
               <Btn styles={styles.button} onClick={handleBalancePayment}
               bgColor={Colors.PRIMARY}
               title="Pay Balance"
             /> 
            )
          }

        </div>
      </div>
    </>

  )
}

// Inline styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    maxHeight:'93vh',
    overflowY: 'auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#4CAF50',
  },
  bookingDetails: {
    margin: '20px 0',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  paymentSummary: {
    margin: '20px 0',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftAlign: {
    textAlign: 'left',
  },
  rightAlign: {
    textAlign: 'right',
  },
  divider: {
    borderTop: '1px solid #ccc',
    margin: '10px 0',
  },
  button:{
    margin:'4px'
  }
};

export default BookingDetails