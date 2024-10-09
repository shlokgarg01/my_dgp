import {
    CLEAR_ERRORS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS
  } from "../constants/LoginConstants";
  
  export const LoginReducer = (state = { loginData: [] }, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          loading: true,
          loginData: []
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          loginData: action.payload,
        };
      case LOGIN_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          loginData: []
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
  