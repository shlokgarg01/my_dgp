import {
    CLEAR_ERRORS,
    CUSTOMER_SIGNUP_FAIL,
    CUSTOMER_SIGNUP_REQUEST,
    CUSTOMER_SIGNUP_SUCCESS,
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

  export const RegisterCustomerReducer = (state ={data:[]},action)=>{
    switch (action.type) {
      case CUSTOMER_SIGNUP_REQUEST:
        return {
          loading: true,
          data: []
        };
      case CUSTOMER_SIGNUP_SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case CUSTOMER_SIGNUP_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          data: []
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  }
  