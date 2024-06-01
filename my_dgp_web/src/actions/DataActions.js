import { ADD_DATA_REQUEST, CLEAR_DATA } from "../constants/DataConstants";

// create a new booking
export const saveData = (data) => {
  return {
    type: ADD_DATA_REQUEST,
    data,
  };
};

// Used to clear all the data
export const clearData = () => {
  return {
    type: CLEAR_DATA,
  };
};
