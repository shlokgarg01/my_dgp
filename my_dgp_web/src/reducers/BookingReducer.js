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

export const ConfirmBookingReducer = (
  state = { confirmedBooking: {} },
  action
) => {
  switch (action.type) {
    case CONFIRM_BOOKING_STATUS_REQUEST:
      return {
        loading: true,
        status: state?.status,
      };
    case CONFIRM_BOOKING_STATUS_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        booking: action.payload.booking,
        status: action.payload.status,
        service_provider: action.payload.service_provider,
      };
    case CONFIRM_BOOKING_STATUS_FAIL:
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

export const CancelBookingReducer = (
  state = { cancelledBooking: {} },
  action
) => {
  switch (action.type) {
    case CANCEL_BOOKING_REQUEST:
      return {
        loading: true
      };
    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        isCancelled: true
      };
    case CANCEL_BOOKING_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        isCancelled: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isCancelled: false
      };
    default:
      return state;
  }
};
