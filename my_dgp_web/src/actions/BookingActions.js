import axiosInstance from "../config/Axios";
import {
  CANCEL_BOOKING_FAIL,
  CANCEL_BOOKING_REQUEST,
  CANCEL_BOOKING_SUCCESS,
  CLEAR_ERRORS,
  CONFIRM_BOOKING_STATUS_FAIL,
  CONFIRM_BOOKING_STATUS_REQUEST,
  CONFIRM_BOOKING_STATUS_SUCCESS,
  CREATE_BOOKING_FAIL,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
} from "../constants/BookingsConstants";

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

// cancel a booking
export const cancelBooking = (bookingId) => async (dispatch) => {
  try {
    dispatch({ type: CANCEL_BOOKING_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/v1/bookingrequest/cancel/${bookingId}`,
      {},
      config
    );

    dispatch({ type: CANCEL_BOOKING_SUCCESS, payload: data.booking });
  } catch (error) {
    dispatch({
      type: CANCEL_BOOKING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// confirm booking status from searching rider screen
export const confirmBookingStatus = (bookingId) => async (dispatch) => {
  try {
    dispatch({ type: CONFIRM_BOOKING_STATUS_REQUEST });
    const { data } = await axiosInstance.get(
      `/api/v1/bookings/status/${bookingId}`
    );

    dispatch({ type: CONFIRM_BOOKING_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CONFIRM_BOOKING_STATUS_FAIL,
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
