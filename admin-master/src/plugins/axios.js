import axios from "axios";
import appConfig from "../config";
import { store } from "../redux";
import auth from "../helpers/AuthHelper";
import { logoutExpire } from "../redux/auth/actions";

axios.defaults.baseURL = appConfig.API_END_POINT;

axios.interceptors.request.use((config) => {
  addRequestHeader(config);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error || !error.response) {
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 500:
        break;
      case 401:
        forceLogout();
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

function addRequestHeader(config) {
  addToken(config);
}

function addToken(config) {
  let token = store.getState().auth.token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
}

function forceLogout() {
  auth.destroyToken();
  store.dispatch(logoutExpire());
}
