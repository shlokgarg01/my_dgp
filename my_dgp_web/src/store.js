import { applyMiddleware, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { UserReducer } from "./reducers/UserReducers";
import { ServiceReducer } from "./reducers/ServiceReducer";
import { BookingReducer, CancelBookingReducer, ConfirmBookingReducer } from "./reducers/BookingReducer";
import { PackageReducer } from "./reducers/PackageReducer";
import { PriceReducer } from './reducers/PriceReducer'
import { ApplyCouponReducer } from "./reducers/CouponReducer";

const reducer = combineReducers({
  user: UserReducer,
  services: ServiceReducer,

  packages: PackageReducer,

  prices: PriceReducer,

  booking: BookingReducer,
  confirmedBooking: ConfirmBookingReducer,
  cancelledBooking: CancelBookingReducer,

  coupon: ApplyCouponReducer
});

const initialState = {};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
