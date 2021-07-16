import actions from "./actions";
import authHelper from "../../helpers/AuthHelper";

const initState = {
  haveError: false,
  token: authHelper.getToken(),
  user: {
    uid: '',
    email: '',
    isAdmin: false,
    fullname: '',
  },
  isAuthenticated: !!authHelper.getToken(),
  loading: false,
  isShowExpireAlert: false,
  errors: {},
}

export default function authReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    // Sign up
    case actions.SIGNUP:
      return {
        ...state,
        loading: true,
      };
    case actions.SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        haveError: false,
        loading: false,
        token: payload
      };
    case actions.SIGNUP_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        haveError: true,
        loading: false,
        errors: payload.error,
      };

    // Login
    case actions.LOGIN:
      return {
        ...state,
        loading: true,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        haveError: false,
        loading: false,
        token: payload
      };
    case actions.LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        haveError: true,
        loading: false,
        errors: payload.error,
      };

    // Get profile
    case actions.GET_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case actions.GET_PROFILE_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        haveError: false,
        loading: false
      };
    case actions.GET_PROFILE_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        haveError: true,
        loading: false,
        errors: payload.error,
      };

    // Logout
    case actions.LOGOUT:
      return { ...state, isAuthenticated: false };
    case actions.LOGOUT_EXPIRE:
      return { ...state, isAuthenticated: false, isShowExpireAlert: true };
    default:
      return state;
  }
}
