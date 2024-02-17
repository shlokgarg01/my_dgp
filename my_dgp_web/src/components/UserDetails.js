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
import InputGroup from "./components/InputGroup";
import LogoHeader from "./components/LogoHeader";
import Btn from "./components/Btn";
import { FaPhone } from "react-icons/fa";
import { MdOutlineMail, MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import "../styles/ComponentStyles.css";

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
    <div className="container">
      <div className="subContainer">
        <div>
          <LogoHeader />
          <div
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 7,
              textAlign: "center",
            }}
          >
            Please enter your details
          </div>
          <div
            style={{
              color: Colors.GRAY,
              lineHeight: 1.3,
              textAlign: "center",
              paddingLeft: 25,
              paddingRight: 25,
              marginBottom: 25,
            }}
          >
            These details will be used for the order fullfilment and
            communications.
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <InputGroup
              icon={
                <MdDriveFileRenameOutline size={25} color={Colors.DARK_GRAY} />
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
            <InputGroup
              icon={<MdOutlineMail size={25} color={Colors.DARK_GRAY} />}
              placeholder="Email id"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroup
              icon={<FaPhone size={25} color={Colors.DARK_GRAY} />}
              placeholder="Contact Number"
              type="number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            {firebaseConfirmation ? (
              <InputGroup
                icon={<AiOutlineLogin size={25} color={Colors.DARK_GRAY} />}
                placeholder="Enter the OTP"
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            ) : null}

            <div id="captcha-container"></div>
          </form>
        </div>
        <Btn
          onClick={firebaseConfirmation ? submit : sendOTP}
          title={firebaseConfirmation ? "Submit" : "Send OTP"}
        />
      </div>
    </div>
  );
}
