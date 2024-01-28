import React, { useEffect, useState } from "react";
import Colors from "../utils/Colors";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginViaOTP } from "../actions/UserActions";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config";
import Loader from "./Loader";

export default function UserDetails() {
  const dispatch = useDispatch();
  let [params] = useSearchParams();
  const navigate = useNavigate();

  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const [contactNumber, setContactNumber] = useState();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(null);
  const [firebaseConfirmation, setFirebaseConfirmation] = useState(null);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate({
        pathname: "/checkout",
        search: createSearchParams({
          service: params.get("service"),
          serviceName: params.get("serviceName"),
          address: params.get("address"),
          date: params.get("date"),
          hours: params.get("hours"),
          customer: user._id,
          taxPrice: params.get("taxPrice"),
          itemsPrice: params.get("itemsPrice"),
          totalPrice: params.get("totalPrice"),
          name,
          email,
          contactNumber,
        }).toString(),
      });
    }
  }, [dispatch, error, isAuthenticated]);

  const sendOTP = async () => {
    if (!name) {
      alert("Please enter your name");
      return;
    } else if (!email) {
      alert("Please enter your email");
      return;
    } else if (!contactNumber || contactNumber.length !== 10) {
      alert("Invalid contact number");
      return;
    }

    const recaptcha = new RecaptchaVerifier(auth, "captcha-container", {
      size: "invisible",
    });
    const confirmation = await signInWithPhoneNumber(
      auth,
      `+91${contactNumber}`,
      recaptcha
    );
    setFirebaseConfirmation(confirmation);
  };

  const submit = async () => {
    try {
      await firebaseConfirmation.confirm(otp);
      dispatch(loginViaOTP({ name, email, contactNumber }));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div style={{ paddingTop: 40, paddingLeft: 22, paddingRight: 22 }}>
      <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 7 }}>
        Please enter your details for verification
      </div>
      <div style={{ color: Colors.GRAY, lineHeight: 1.1 }}>
        These details will be used for the order fullfilment and communications.
        You shall receive an SMS with the verfication code on the below number
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Your Name"
          style={{ borderRadius: 7, width: "80%", marginTop: 16 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Your Email id"
          style={{ borderRadius: 7, width: "80%", marginTop: 16 }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Your Number"
          style={{ borderRadius: 7, width: "80%", marginTop: 16 }}
          type="number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        {firebaseConfirmation ? (
          <input
            placeholder="Enter the OTP"
            style={{ borderRadius: 7, width: "80%", marginTop: 16 }}
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        ) : null}

        <div id="captcha-container"></div>
        <button
          onClick={firebaseConfirmation ? submit : sendOTP}
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
          {firebaseConfirmation ? "Submit" : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
