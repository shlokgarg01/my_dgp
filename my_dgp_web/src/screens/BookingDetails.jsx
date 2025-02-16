import React, { useEffect, useState } from 'react'
import HamburgerMenu from '../components/components/HamburgerMenu';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmBookingStatus } from '../actions/BookingActions';
import Colors from '../utils/Colors';
import { IoLogoWhatsapp, IoMdCall } from 'react-icons/io';

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
        {booking?.status != "COMPLETED" && <div style={styles.bookingDetails}>
          <h3>Service Provider</h3>
          {renderRiderDetails()}
        </div>}
       {booking?.status ==="ACCEPTED" && <div style={styles.bookingDetails}>
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
         {booking?.paymentInfo?.paymentReceived < 1 ?
         <div style={styles.row}>
         <p style={{ ...styles.leftAlign, fontWeight: 'bold' }}>Advance Payment</p>
         <p style={{ ...styles.rightAlign, fontWeight: 'bold' }}>₹{(booking?.totalPrice + booking?.taxPrice)/2}</p>
       </div>
         :<div style={styles.row}>
            <p style={{ ...styles.leftAlign, fontWeight: 'bold' }}>Balance Payment</p>
            <p style={{ ...styles.rightAlign, fontWeight: 'bold' }}>₹{booking?.paymentInfo?.balancePayment}</p>
          </div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'sticky', left: 0, right: 0, bottom: 10, backgroundColor: 'white' }}>
          { booking?.status==="ACCEPTED" && <button style={{ backgroundColor: Colors.RED, margin: '4px', }} className="btn-pay" onClick={() => { }}>
            Cancel Booking
          </button>}
          {booking?.paymentInfo?.paymentReceived < 1 ?
            <button style={{ margin: '4px' }} className="btn-pay" onClick={() => { }}>
              Pay Advance
            </button> :
            booking?.paymentInfo?.status != "PAID" && (
              <button style={{ margin: '4px' }} className="btn-pay" onClick={() => { }}>
                Pay Balance
              </button>
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
};

export default BookingDetails