import {
  CLEAR_ERRORS,
  GET_SERVICES_FAIL,
  GET_SERVICES_REQUEST,
  GET_SERVICES_SUCCESS,
} from "../constants/ServiceConstants";

export const ServiceReducer = (state = { services: [] }, action) => {
  switch (action.type) {
    case GET_SERVICES_REQUEST:
      return {
        loading: true,
      };
    case GET_SERVICES_SUCCESS:
      return {
        ...state,
        loading: false,
        services: action.payload,
      };
    case GET_SERVICES_FAIL:
      return {
        ...state,
        loading: false,
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
