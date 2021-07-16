const API_BASE = process.env.REACT_APP_API_BASE;
const API_END_POINT = `${API_BASE}/api`;
const TOKEN_LIFE_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
const APP_VERSION = `${process.env.REACT_APP_VERSION}`;

const firebaseConfig = require("./firebaseConfig").firebaseConfig;

export default {
  API_BASE,
  API_END_POINT,
  TOKEN_LIFE_TIME,
  APP_VERSION,
  firebaseConfig,
};
