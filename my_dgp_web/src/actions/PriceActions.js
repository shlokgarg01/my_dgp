import axiosInstance from "../config/Axios";
import {
  CLEAR_ERRORS,
  GET_PRICES_FAIL,
  GET_PRICES_REQUEST,
  GET_PRICES_SUCCESS,
} from "../constants/PriceConstants";

// get all prices
export const getAllPrices = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PRICES_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/prices`);

    dispatch({ type: GET_PRICES_SUCCESS, payload: data.prices });
  } catch (error) {
    dispatch({
      type: GET_PRICES_FAIL,
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
