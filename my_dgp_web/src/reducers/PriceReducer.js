import {
  CLEAR_ERRORS,
  GET_PRICES_FAIL,
  GET_PRICES_REQUEST,
  GET_PRICES_SUCCESS,
} from "../constants/PriceConstants";

export const PriceReducer = (state = { prices: [] }, action) => {
  switch (action.type) {
    case GET_PRICES_REQUEST:
      return {
        loading: true,
        prices: [],
      };
    case GET_PRICES_SUCCESS:
      return {
        ...state,
        loading: false,
        prices: action.payload,
      };
    case GET_PRICES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        prices: [],
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
