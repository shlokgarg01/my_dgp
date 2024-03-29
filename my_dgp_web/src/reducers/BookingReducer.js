import {
  CLEAR_ERRORS,
  CREATE_BOOKING_FAIL,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
} from "../constants/BookingsConstants";

export const BookingReducer = (state = { booking: {} }, action) => {
  switch (action.type) {
    case CREATE_BOOKING_REQUEST:
      return {
        loading: true,
      };
    case CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        booking: action.payload,
      };
    case CREATE_BOOKING_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
