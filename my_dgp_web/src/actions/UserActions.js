import {
  ADMIN_LOGIN_SEND_OTP_FAIL,
  ADMIN_LOGIN_SEND_OTP_REQUEST,
  ADMIN_LOGIN_SEND_OTP_SUCCESS,
  CLEAR_ERRORS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
} from "../constants/UserConstants";
import axiosInstance from "../config/Axios";

// send OTP FOR LOGIN
export const sendOPTPLogin = (contactNumber) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_SEND_OTP_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/login/otp/send`,
      { contactNumber },
      config
    );

    dispatch({ type: ADMIN_LOGIN_SEND_OTP_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_SEND_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Verify OTP & Login
export const loginViaOTP = (userDetails) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/login/otp/verify`,
      { contactNumber: userDetails.contactNumber },
      config
    );
    localStorage.setItem("token", JSON.stringify(data.token));

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    if (error.response.status === 404) {
      dispatch(registerUser(userDetails));
    } else {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response.data.message,
      });
    }
  }
};

// Register User after OTP verification
export const registerUser = (userDetails) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/register/otp`,
      userDetails,
      config
    );
    localStorage.setItem("token", JSON.stringify(data.token));

    dispatch({ type: USER_SIGNUP_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// logout user
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.get(`/api/v1/logout`);
    localStorage.clear();
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
