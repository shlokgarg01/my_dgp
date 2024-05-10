import axiosInstance from "../config/Axios";
import {
  APPLY_COUPON_FAIL,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/CouponConstants";

// create a new booking
export const applyCouponToBooking = (code, cartValue) => async (dispatch) => {
  try {
    dispatch({ type: APPLY_COUPON_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/coupon/validate`,
      { code, cartValue },
      config
    );
    dispatch({ type: APPLY_COUPON_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: APPLY_COUPON_FAIL,
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
