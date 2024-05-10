import {
  APPLY_COUPON_FAIL,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/CouponConstants";

export const ApplyCouponReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case APPLY_COUPON_REQUEST:
      return {
        loading: true,
        discount: 0
      };
    case APPLY_COUPON_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        coupon: action.payload.coupon,
        discount: action.payload.discount,
        finalPrice: action.payload.finalPrice
      };
    case APPLY_COUPON_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
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
