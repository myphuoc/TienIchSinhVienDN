import { combineReducers } from "redux";

import auth from "./auth/reducer";
import sharedPosts from "./sharedPosts/reducer";
import authActions from "./auth/actions";

const appReducer = combineReducers({
  auth,
  sharedPosts
});

// Reset all state when logout
const rootReducer = (state, action) => {
  if (action.type === authActions.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
