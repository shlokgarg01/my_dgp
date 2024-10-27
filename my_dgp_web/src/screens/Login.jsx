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
import { saveData } from "../actions/DataActions";
import { isExisting, registerCustomer } from "../actions/LoginActions";

export default function Login() {
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
  const [captchaElementCount, setCaptchaElementCount] = useState(0);
  let [timer, setTimer] = useState(TIMER);
  const { loginData } = useSelector((state) => state.loginData);
  const [isRegistered, setRegistered] = useState(true);
  const registerCustomerReducer = useSelector((state) => state.registerCustomerReducer);

  //register action
  useEffect(() => {
    if (loginData?.success) {
      setRegistered(loginData?.isRegistered);
      if (loginData?.isRegistered) {
        if (contactNumber && contactNumber != undefined) {
          localStorage.setItem('userNumber', contactNumber);
          localStorage.setItem('userId', loginData?.user?._id);
        }
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
            customer: loginData?.user?._id,
            taxPrice: params.get("taxPrice"),
            itemsPrice: params.get("itemsPrice"),
            totalPrice: params.get("totalPrice"),
            name: loginData?.user?.name,
            email: loginData?.user?.email,
            contactNumber: loginData?.user?.contactNumber,
          }).toString(),
        });
      }
    }
  }, [loginData])

  useEffect(() => {
    if (!registerCustomerReducer?.data?.success && registerCustomerReducer?.data?.message) {
      toast.error(registerCustomerReducer?.data?.message);
    }
    if (registerCustomerReducer?.data?.success) {
      if (contactNumber && contactNumber != undefined) {
        localStorage.setItem('userNumber', contactNumber);
        localStorage.setItem('userId', loginData?.user?._id);
      }
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
          customer: loginData?.user?._id,
          taxPrice: params.get("taxPrice"),
          itemsPrice: params.get("itemsPrice"),
          totalPrice: params.get("totalPrice"),
          name,
          email,
          contactNumber,
        }).toString(),
      });
    }
  }, [registerCustomerReducer])



  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      setOtpLoading(false);
      dispatch({ type: CLEAR_ERRORS });
      dispatch(isExisting(contactNumber))
    }
    // eslint-disable-next-line
  }, [dispatch, error, isAuthenticated]);

  useEffect(() => {
    const storedUser = localStorage.getItem('userNumber');
    if (storedUser) {
      setOtpLoading(true);
      dispatch(isExisting(storedUser))
      // navigate({
      //   pathname: "/checkout",
      //   search: createSearchParams({
      //     service: params.get("service"),
      //     serviceName: params.get("serviceName"),
      //     subService: params.get("subService"),
      //     subServiceName: params.get("subServiceName"),
      //     servicePackage: params.get("servicePackage"),
      //     packageName: params.get("packageName"),
      //     address: params.get("address"),
      //     lat: params.get("lat"),
      //     lng: params.get("lng"),
      //     date: params.get("date"),
      //     hours: params.get("hours"),
      //     minutes: params.get("minutes"),
      //     customer: user._id,
      //     taxPrice: params.get("taxPrice"),
      //     itemsPrice: params.get("itemsPrice"),
      //     totalPrice: params.get("totalPrice"),
      //     name,
      //     email,
      //     contactNumber: storedUser,
      //   }).toString(),
      // })
    }
  }, [])


  // setting the timer for resend OTP
  useEffect(() => {
    const timerID = setInterval(() => {
      if (timer > 0) setTimer(--timer);
    }, 1000);
    return () => clearInterval(timerID);
  });

  const validateOTPSend = () => {
    if (!contactNumber || contactNumber.length !== 10) {
      toast.error("Invalid contact number");
      return false;
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
      let data = { name, email, contactNumber };
      dispatch(saveData(data));
      dispatch(loginViaOTP(data));
    } catch (err) {
      toast.error("Invalid OTP! Please try again.");
      setOtpLoading(false);
    }
  };

  const handleSubmitBtn = () => {
    if (!isRegistered) {
      const registerCustomerPayload = {
        name, email, contactNumber
      }
      dispatch(registerCustomer(registerCustomerPayload))
    }
    else if (!loading) {
      if (firebaseConfirmation && !editNumber) {
        submit();
      } else {
        sendOTP()
      }
    }
  }

  return (
    <div>
      {otpLoading ? (
        <LoaderComponent />
      ) : (
        <div>
          <div className="subContainer" style={{ height: "100%" }}>
            <div>
              <div style={{ backgroundColor: Colors.PRIMARY, paddingBottom: 10, paddingTop: 20 }} >
                <LogoHeader showLogo={true} />
              </div>
              <div style={{ padding: 30 }}>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginBottom: 7,
                    textAlign: "center",
                    paddingTop: 20,
                  }}
                >
                  {isRegistered ? 'Login to process your order' : 'Welcome !'}
                </div>
                <div
                  style={{
                    color: Colors.GRAY,
                    lineHeight: 1.3,
                    textAlign: "center",
                    paddingLeft: 25,
                    paddingRight: 25,
                    marginBottom: 25,
                    fontSize:15
                  }}
                >
                  {isRegistered ? 'A 4-digit OTP will be sent on SMS' : 'We need your name and email id to register'}
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{ textAlign: "center" }}
                >
                  {isRegistered && <div>
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
                          maxLength="6"
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
                  </div>}
                  {!isRegistered &&
                    <div>
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
                      />
                      <InputGroup
                        icon={<MdOutlineMail size={25} color={Colors.DARK_GRAY} />}
                        placeholder="Email id"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  }
                  <div id="captcha-container"></div>
                  <Btn
                    onClick={
                      handleSubmitBtn
                    }
                    title={
                      firebaseConfirmation && !editNumber ? "Submit" : "Send OTP"
                    }
                    loading={loading}
                  />
                  <div style={{ fontSize: 12 }} >By continue you agree to MYDGP'S <a href="./terms-and-conditions" >terms of use</a> and <a href="./privacy-policy" >privacy policy</a></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
