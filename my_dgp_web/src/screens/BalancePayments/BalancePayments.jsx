import React, { useEffect, useState } from "react";
import "./BalancePayments.css";
import { useLocation } from "react-router-dom";

// e.g.http://localhost:3000/balance-payment?amount=221.0
const BalancePayments = () => {
  const [selectedPayment, setSelectedPayment] = useState(true);
  const location = useLocation(); //get url
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const amountFromQuery = queryParams.get("amount");

    if (amountFromQuery) {
      setAmount(amountFromQuery);
    }
  }, [location]); // Run this effect whenever the location changes

  const handlePayment = () => {
    if (selectedPayment) {
      alert("Proceeding to payment...");
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
        <span className="check-icon">✔</span> Booking Complete
      </div>

      <div className="warning">Pay Balance to get photos in 24hrs.</div>

      <div className="amount-section">
        <h2>Balance Amount to pay</h2>
        {/* <h3>Aakash Saklani</h3> */}

        <div className="amount">
          ₹{amount}
        </div>
      </div>
      <div className="note">
        <strong>NOTE:</strong> If you do not make the balance payment within 7
        days, we are not responsible for your data loss.
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

export default BalancePayments