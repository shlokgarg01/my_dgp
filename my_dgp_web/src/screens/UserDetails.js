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
import InputGroup from "../components/components/InputGroup";
import LogoHeader from "../components/components/LogoHeader";
import Btn from "../components/components/Btn";
import { FaPhone } from "react-icons/fa";
import { MdOutlineMail, MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import "../styles/ComponentStyles.css";
import LoaderComponent from "../components/Loader";
import { toast } from "react-custom-alert";
import { CLEAR_ERRORS } from "../constants/UserConstants";
import { EMAIL_REGEX } from "../config/Config";
import { saveData } from "../actions/DataActions";

export default function UserDetails() {
  const TIMER = 59;
  const dispatch = useDispatch();
  let [params] = useSearchParams();
  const navigate = useNavigate();
  const { savedData } = useSelector((state) => state.savedData);

  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState(savedData.contactNumber);
  const [email, setEmail] = useState(savedData.email || "");
  const [name, setName] = useState(savedData.name || "");
  const [otp, setOtp] = useState(null);
  const [firebaseConfirmation, setFirebaseConfirmation] = useState(null);
  const [editNumber, setEditNumber] = useState(false);
  const [someoneElseBooking, setSomeoneElseBooking] = useState(false);
  const [captchaElementCount, setCaptchaElementCount] = useState(0);
  let [timer, setTimer] = useState(TIMER);

  const [someoneElseName, setSomeoneElseName] = useState("");
  const [someoneElseNumber, setSomeoneElseNumber] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      setOtpLoading(false);
      dispatch({ type: CLEAR_ERRORS });
      navigate({
        pathname: "/checkout",
        search: createSearchParams({
          service: params.get("service"),
          serviceName: params.get("serviceName"),
          subService: params.get("subService"),
          subServiceName: params.get("subServiceName"),
          servicePackage: params.get("servicePackage"),
          packageName: params.get("packageName"),
          address: params.get("address"),
          lat: params.get("lat"),
          lng: params.get("lng"),
          date: params.get("date"),
          hours: params.get("hours"),
          minutes: params.get("minutes"),
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
    // eslint-disable-next-line
  }, [dispatch, error, isAuthenticated]);

  // setting the timer for resend OTP
  useEffect(() => {
    const timerID = setInterval(() => {
      if (timer > 0) setTimer(--timer);
    }, 1000);
    return () => clearInterval(timerID);
  });

  const validateOTPSend = () => {
    if (!name) {
      toast.error("Please enter your name");
      return false;
    } else if (!isNaN(+name)) {
      // true means it's a Number, else a String
      toast.error("Invalid Name");
      return false;
    } else if (!email) {
      toast.error("Please enter your email");
      return false;
    } else if (!EMAIL_REGEX.test(email)) {
      toast.error("Invalid email!");
      return false;
    } else if (!contactNumber || contactNumber.length !== 10) {
      toast.error("Invalid contact number");
      return false;
    }
    else if (someoneElseBooking) {
      if ((!someoneElseNumber || someoneElseNumber.length !== 10)) {
        toast.error("Invalid contact number");
        return false;
      } else if (!someoneElseName) {
        toast.error("Please enter your name");
        return false;
      } else if (!isNaN(+someoneElseName)) {
        // true means it's a Number, else a String
        toast.error("Invalid Name");
        return false;
      }
    }

    return true;
  };

  const addCaptchaDiv = () => {
    let captcha_id = `captcha-container-${captchaElementCount}`;
    const node = document.createElement("div");
    node.setAttribute("id", captcha_id);

    document.getElementById("captcha-container").appendChild(node);
    setCaptchaElementCount(captchaElementCount + 1);
    return captcha_id;
  };

  const sendOTP = async () => {
    if (validateOTPSend()) {
      let captcha_id = addCaptchaDiv();
      setLoading(true);
      const recaptcha = new RecaptchaVerifier(auth, captcha_id, {
        size: "invisible",
      });
      let contactNoOTP = contactNumber
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${contactNoOTP}`,
        recaptcha
      );
      setLoading(false);
      setFirebaseConfirmation(confirmation);
      setEditNumber(false);
      setTimer(TIMER);
    }
  };

  const submit = async () => {
    try {
      setOtpLoading(true);
      await firebaseConfirmation.confirm(otp);

      //  contactNumber = someoneElseBooking ? someoneElseNumber : contactNumber;
      //  name = someoneElseBooking ? someoneElseName :  name
      let data = { name, email, contactNumber };
      dispatch(saveData(data));
      dispatch(loginViaOTP(data));
    } catch (err) {
      toast.error("Invalid OTP! Please try again.");
      setOtpLoading(false);
    }
  };

  return (
    <div>
      {otpLoading ? (
        <LoaderComponent />
      ) : (
        <div className="custom-container">
          <div className="subContainer" style={{ height: "100%" }}>
            <div>
              <LogoHeader showLogo={true} />
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

              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ textAlign: "center" }}
              >
                <InputGroup
                  icon={
                    <MdDriveFileRenameOutline
                      size={25}
                      color={Colors.DARK_GRAY}
                    />
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  disabled={firebaseConfirmation || loading}
                />
                <InputGroup
                  icon={<MdOutlineMail size={25} color={Colors.DARK_GRAY} />}
                  placeholder="Email id"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={firebaseConfirmation || loading}
                />
                <InputGroup
                  icon={<FaPhone size={25} color={Colors.DARK_GRAY} />}
                  placeholder="Contact Number"
                  type="number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={!editNumber && (firebaseConfirmation || loading)}
                  maxLength="10"
                />
                {firebaseConfirmation && !editNumber ? (
                  <>
                    <InputGroup
                      icon={
                        <AiOutlineLogin size={25} color={Colors.DARK_GRAY} />
                      }
                      placeholder="Enter the OTP"
                      type="number"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 4,
                        padding: "0 10px",
                        color: Colors.BLUE,
                        fontWeight: "bold",
                      }}
                    >
                      <div
                        style={{ color: Colors.BLACK }}
                        onClick={() => {
                          setEditNumber(true);
                          setContactNumber("");
                        }}
                      >
                        Entered Wrong Number?
                      </div>
                      <div>
                        <div
                          style={{
                            color: timer === 0 ? Colors.BLUE : Colors.GRAY,
                          }}
                          onClick={timer === 0 ? sendOTP : null}
                        >
                          Resend OTP
                        </div>
                        <div style={{ color: Colors.GRAY, fontSize: 13 }}>{timer} sec</div>
                      </div>
                    </div>
                  </>
                ) : null}

                <div style={{ marginTop: 20, paddingBottom: 10, border: '0.2px solid gray', paddingTop: 10, borderRadius: 10, backgroundColor: 'white' }}>
                  <label style={{ textAlign: 'start', width: '90%', paddingLeft: 10 }} htmlFor="someoneElseBooking" onTouchStart={() => setSomeoneElseBooking(!someoneElseBooking)}>Book For Someone Else</label>
                  <input class="form-check-input" type="checkbox" checked={someoneElseBooking} onChange={() => setSomeoneElseBooking(!someoneElseBooking)} />
                </div>
                {someoneElseBooking &&
                  <>
                    <InputGroup
                      icon={
                        <MdDriveFileRenameOutline
                          size={25}
                          color={Colors.DARK_GRAY}
                        />
                      }
                      value={someoneElseName}
                      onChange={(e) => setSomeoneElseName(e.target.value)}
                      placeholder="Name"
                      disabled={firebaseConfirmation || loading}
                    />
                    <InputGroup
                      icon={<FaPhone size={25} color={Colors.DARK_GRAY} />}
                      placeholder="Contact Number"
                      type="number"
                      value={someoneElseNumber}
                      onChange={(e) => setSomeoneElseNumber(e.target.value)}
                      disabled={!editNumber && (firebaseConfirmation || loading)}
                      maxLength="10"
                    />
                  </>
                }

                <div id="captcha-container"></div>
                <Btn
                  onClick={
                    !loading ? (firebaseConfirmation && !editNumber ? submit : sendOTP) : null
                  }
                  title={
                    firebaseConfirmation && !editNumber ? "Submit" : "Send OTP"
                  }
                  loading={loading}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
