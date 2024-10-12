import { applyMiddleware, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { UserReducer } from "./reducers/UserReducers";
import { ServiceReducer } from "./reducers/ServiceReducer";
import { BookingReducer, CancelBookingReducer, ConfirmBookingReducer } from "./reducers/BookingReducer";
import { PackageReducer } from "./reducers/PackageReducer";
import { PriceReducer } from './reducers/PriceReducer'
import { ApplyCouponReducer } from "./reducers/CouponReducer";
import { SavedDataReducer } from "./reducers/DataReducer";
import { LoginReducer, RegisterCustomerReducer } from "./reducers/LoginReducer";

// Root reducer with reset logic
const appReducer = combineReducers({
  user: UserReducer,
  services: ServiceReducer,
  packages: PackageReducer,
  prices: PriceReducer,
  booking: BookingReducer,
  confirmedBooking: ConfirmBookingReducer,
  cancelledBooking: CancelBookingReducer,
  coupon: ApplyCouponReducer,
  savedData: SavedDataReducer,
  loginData: LoginReducer,
  registerCustomerReducer: RegisterCustomerReducer,
});

// Root reducer to handle resetting the state
const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;  // Reset the state to initial values (or empty state)
  }
  return appReducer(state, action);
};

const initialState = {};

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
