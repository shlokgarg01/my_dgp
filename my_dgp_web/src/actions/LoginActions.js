import axiosInstance from "../config/Axios";
import { CUSTOMER_SIGNUP_FAIL, CUSTOMER_SIGNUP_REQUEST, CUSTOMER_SIGNUP_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS } from "../constants/LoginConstants";

// get all packages
export const isExisting = (contactNumber) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.get(
        `/api/v1/customer/isExist`,
        {
          params: {
            contactNumber,
          },
          ...config,
        }
      );
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data,
      });
    }
  };

// Register User after OTP verification
export const registerCustomer = (customerDetails) => async (dispatch) => {
    try {
      dispatch({ type: CUSTOMER_SIGNUP_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        `/api/v1/customer/register`,
        customerDetails,
        config
      );  
      localStorage.setItem("token", JSON.stringify(data.token));
      dispatch({ type: CUSTOMER_SIGNUP_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CUSTOMER_SIGNUP_FAIL,
        payload: error.response,
      });
    }
  };

