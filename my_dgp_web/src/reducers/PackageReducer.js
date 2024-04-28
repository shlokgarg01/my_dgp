import {
  CLEAR_ERRORS,
  GET_PACKAGES_FAIL,
  GET_PACKAGES_REQUEST,
  GET_PACKAGES_SUCCESS
} from "../constants/PackageConstants";

export const PackageReducer = (state = { packages: [] }, action) => {
  switch (action.type) {
    case GET_PACKAGES_REQUEST:
      return {
        loading: true,
        packages: []
      };
    case GET_PACKAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        packages: action.payload,
      };
    case GET_PACKAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        packages: []
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
