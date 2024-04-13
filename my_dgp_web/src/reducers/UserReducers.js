import {
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SEND_OTP_FAIL,
  ADMIN_LOGIN_SEND_OTP_REQUEST,
  ADMIN_LOGIN_SEND_OTP_SUCCESS,
  ADMIN_LOGIN_SUCCESS,
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

export const UserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
    case USER_LOGIN_REQUEST:
    case USER_SIGNUP_REQUEST:
    case ADMIN_LOGIN_SEND_OTP_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case ADMIN_LOGIN_SEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        cansendOtp: true,
      };
    case ADMIN_LOGIN_FAIL:
    case USER_LOGIN_FAIL:
    case USER_SIGNUP_FAIL:
    case ADMIN_LOGIN_SEND_OTP_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
        cansendOtp: false,
      };
    case ADMIN_LOGIN_SUCCESS:
    case USER_LOGIN_SUCCESS:
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};
