import { ADD_DATA_REQUEST, CLEAR_DATA } from "../constants/DataConstants";

const default_state = { savedData: {} };
export const SavedDataReducer = (state = default_state, action) => {
  switch (action.type) {
    case ADD_DATA_REQUEST:
      return {
        savedData: {
          ...state.savedData,
          ...action.data}
      };
    case CLEAR_DATA:
      return default_state;
    default:
      return state;
  }
};
