import { applyMiddleware, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { UserReducer } from "./reducers/UserReducers";
import { ServiceReducer } from "./reducers/ServiceReducer";
import { BookingReducer } from "./reducers/BookingReducer";

const reducer = combineReducers({
  user: UserReducer,
  services: ServiceReducer,
  booking: BookingReducer
});

const initialState = {};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
