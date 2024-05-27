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
import {
  MdOutlineMail,
  MdDriveFileRenameOutline,
  MdOutlineEdit,
} from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import "../styles/ComponentStyles.css";
import LoaderComponent from "../components/Loader";
import { toast } from "react-custom-alert";
import { CLEAR_ERRORS } from "../constants/UserConstants";
import { EMAIL_REGEX } from "../config/Config";

export default function UserDetails() {
  const dispatch = useDispatch();
  let [params] = useSearchParams();
  const navigate = useNavigate();

  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(null);
  const [firebaseConfirmation, setFirebaseConfirmation] = useState(null);
  const [editNumber, setEditNumber] = useState(false);

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

  const validateOTPSend = () => {
    if (!name) {
      toast.error("Please enter your name");
      return false;
    } else if (!isNaN(+name)) { // true means it's a Number, else a String
      toast.error("Invalid Name");
      return false;
    } else if (!email) {
      toast.error("Please enter your email");
      return false;
    } else if (!EMAIL_REGEX.test(email)) {
      toast.error("Invalid email!")
      return false;
    } else if (!contactNumber || contactNumber.length !== 10) {
      toast.error("Invalid contact number");
      return false;
    }
    return true;
  };

  const resendOTP = async () => {
    if (validateOTPSend()) {
      setLoading(true);
      const recaptcha = new RecaptchaVerifier(
        auth,
        `captcha-container-resend`,
        {
          size: "invisible",
        }
      );
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${contactNumber}`,
        recaptcha
      );
      setLoading(false);
      setFirebaseConfirmation(confirmation);
    }
  };

  const sendOTP = async () => {
    if (validateOTPSend()) {
      setLoading(true);
      const recaptcha = new RecaptchaVerifier(auth, "captcha-container", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${contactNumber}`,
        recaptcha
      );
      setLoading(false);
      setFirebaseConfirmation(confirmation);
    }
  };

  const submit = async () => {
    try {
      setOtpLoading(true);
      await firebaseConfirmation.confirm(otp);
      dispatch(loginViaOTP({ name, email, contactNumber }));
    } catch (err) {
      toast.error(error);
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
                  trailingIcon={
                    firebaseConfirmation ? (
                      <MdOutlineEdit
                        size={25}
                        color={Colors.DARK_GRAY}
                        onClick={() => setEditNumber(true)}
                      />
                    ) : null
                  }
                  placeholder="Contact Number"
                  type="number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={(!editNumber) && (firebaseConfirmation || loading)}
                />

                {firebaseConfirmation ? (
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
                      onClick={resendOTP}
                      style={{
                        color: Colors.BLUE,
                        textAlign: "right",
                        marginTop: 4,
                        marginRight: 7,
                        fontWeight: "bold",
                      }}
                    >
                      Resend OTP
                    </div>
                  </>
                ) : null}

                <div id="captcha-container" />
                <div id="captcha-container-resend" />
                <Btn
                  onClick={firebaseConfirmation ? submit : sendOTP}
                  title={firebaseConfirmation ? "Submit" : "Send OTP"}
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
