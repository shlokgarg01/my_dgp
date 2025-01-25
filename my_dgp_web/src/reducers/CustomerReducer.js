
  export const CustomerReducer = (state = { CUSTOMER: {} }, action) => {
    switch (action.type) {
    
      case "CUSTOMER_LOGIN_REQUEST":
        return {
          loading: true,
          isAuthenticated: false,
        };
      case "CUSTOMER_LOGIN_FAIL":
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          error: action.payload,
          cansendOtp: false,
        };
      case "CUSTOMER_LOGIN_SUCCESS":
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          CUSTOMER: action.payload,
        };
      case "CLEAR_ERRORS":
        return {
          ...state,
          isAuthenticated: false,
          error: null,
        };
      default:
        return state;
    }
  };
  