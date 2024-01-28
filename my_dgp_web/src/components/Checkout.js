import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Colors from "../utils/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createBooking } from "../actions/BookingActions";
import Enums from "../utils/Enums";
import Loader from './Loader'

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { error, loading, success } = useSelector((state) => state.booking);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if(success) {
      alert("Your booking has been created successfully!")
      navigate("/")
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

  return (
    <div style={{ padding: 25 }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Order Details
          </div>

          <div style={styles.packagePricesContainer}>
            <div style={styles.heading}>Customer Details</div>
            <div style={{ paddingLeft: 10 }}>
              <b>Name:</b> {data.name}
              <br />
              <b>Email:</b> {data.email}
              <br />
              <b>Contact Number:</b> {data.contactNumber}
              <br />
            </div>
            <br />

            <div style={styles.heading}>Service Details</div>
            <div style={{ paddingLeft: 10 }}>
              <b>Service:</b> {data.serviceName}
              <br />
              <b>Date & Time:</b> {data.date.slice(0, 15)} for {data.hours}{" "}
              {data.hours === 1 ? "hr" : "hrs"}
              <br />
            </div>
            <br />

            <div style={styles.heading}>Charges</div>
            <div style={{ paddingLeft: 10 }}>
              <b>Prices:</b> ₹ {data.itemsPrice}
              <br />
              <b>Tax:</b> ₹ {data.taxPrice}
              <br />
              <b>Total Price:</b> ₹ {data.totalPrice}
              <br />
            </div>
          </div>

          <button
            onClick={submit}
            style={{
              width: "80%",
              backgroundColor: Colors.PRIMARY,
              color: Colors.WHITE,
              marginLeft: "10%",
              borderRadius: 10,
              border: 0,
              marginTop: 16,
              marginBottom: 10,
            }}
          >
            Make Payment
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  packagePricesContainer: {
    marginLeft: "5%",
    width: "90%",
    boxShadow: `1px 1px 10px ${Colors.GRAY}`,
    padding: 10,
    borderRadius: 7,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
  },
};
