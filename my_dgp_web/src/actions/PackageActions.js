import axiosInstance from "../config/Axios";
import {CLEAR_ERRORS, GET_PACKAGES_FAIL, GET_PACKAGES_REQUEST, GET_PACKAGES_SUCCESS} from '../constants/PackageConstants'

// get all packages
export const getAllPackages = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PACKAGES_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/packages`);

    dispatch({ type: GET_PACKAGES_SUCCESS, payload: data.packages });
  } catch (error) {
    dispatch({
      type: GET_PACKAGES_FAIL,
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