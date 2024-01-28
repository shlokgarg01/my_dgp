import axiosInstance from "../config/Axios";
import { CLEAR_ERRORS, CREATE_BOOKING_FAIL, CREATE_BOOKING_REQUEST, CREATE_BOOKING_SUCCESS } from "../constants/BookingsConstants";

// create a new booking
export const createBooking = (bookingData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_BOOKING_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/bookings/new`,
      bookingData,
      config
    );

    dispatch({ type: CREATE_BOOKING_SUCCESS, payload: data.booking });
  } catch (error) {
    dispatch({
      type: CREATE_BOOKING_FAIL,
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