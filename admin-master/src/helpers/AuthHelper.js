import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import config from "../config";

var _token = undefined;

const getToken = () => {
  if (_token) return _token;
  let storedToken = Cookies.get("TOKEN");
  _token = storedToken;
  return storedToken;
};

const getTokenParse = () => {
  const token = getToken();
  return token && jwtDecode(token);
};

const getUserInfo = () => {
  return getTokenParse();
};

const saveToken = (token) => {
  _token = token;
  var expireTime = new Date(new Date().getTime() + config.TOKEN_LIFE_TIME);
  Cookies.set("TOKEN", token, { expires: expireTime });
  return token;
};

const destroyToken = () => {
  _token = undefined;
  Cookies.remove("TOKEN");
};

export default {
  getToken,
  saveToken,
  destroyToken,
  getTokenParse,
  getUserInfo,
};
