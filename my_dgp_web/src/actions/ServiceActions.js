import axiosInstance from "../config/Axios";
import {
  CLEAR_ERRORS,
  GET_SERVICES_FAIL,
  GET_SERVICES_REQUEST,
  GET_SERVICES_SUCCESS,
} from "../constants/ServiceConstants";

// get all services
export const getAllServices = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVICES_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/services`);

    dispatch({ type: GET_SERVICES_SUCCESS, payload: data.services });
  } catch (error) {
    dispatch({
      type: GET_SERVICES_FAIL,
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