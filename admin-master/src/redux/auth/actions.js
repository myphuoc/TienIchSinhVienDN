const actions = {
  LOGIN: "auth/LOGIN",
  LOGIN_SUCCESS: "auth/LOGIN_SUCCESS",
  LOGIN_FAIL: "auth/LOGIN_FAIL",
  GET_PROFILE: "auth/GET_PROFILE",
  GET_PROFILE_SUCCESS: "auth/GET_PROFILE_SUCCESS",
  GET_PROFILE_FAIL: "auth/GET_PROFILE_FAIL",
  LOGOUT: "auth/LOGOUT",
  LOGOUT_EXPIRE: "auth/LOGOUT_EXPIRE",
};

export default actions;

export const login = (email, password) => ({
  type: actions.LOGIN,
  payload: { email, password },
});

export const getProfile = () => ({ type: actions.GET_PROFILE });
export const logout = () => ({ type: actions.LOGOUT });
export const logoutExpire = () => ({ type: actions.LOGOUT_EXPIRE });
