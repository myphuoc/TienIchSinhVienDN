import { call, put, takeLatest } from "redux-saga/effects";
import firebase, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { notification } from "antd";

import actions from "./actions";
import authHelper from "../../helpers/AuthHelper";

function* signup(data) {
  const { fullname, email, password } = data.payload;
  try {
    const user = yield call(signupFirebase.bind(this, email, password));
    const userData = {
      uid: user.uid,
      fullname,
      email,
      phoneNumber: '',
      isAdmin: false,
      isActive: true,
    }
    yield updateFirestore(userData)
    const token = yield user.getIdToken(true)
    yield put({ type: actions.SIGNUP_SUCCESS, payload: token });
    authHelper.saveToken(token)
    yield put({ type: actions.GET_PROFILE });
  } catch (error) {
    notification.error({ message: "Signup failed" });
    yield put({ type: actions.SIGNUP_FAIL, payload: { error } });
  }
}

async function getUserByUid(uid) {
  const doc = await firestore().collection("users").doc(uid).get()
  if (!doc.exists) {
    notification.error({ message: "Get user failed!" });
  } else {
    return doc.data()
  }
}

async function updateFirestore(user) {
  await firestore().collection("users").doc(user.uid).set({ ...user })
}

async function signupFirebase(email, password) {
  const { user } = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  return user
}

function* login(data) {
  const { email, password } = data.payload;
  try {
    const token = yield call(loginFirebase.bind(this, email, password));
    yield put({ type: actions.LOGIN_SUCCESS, payload: token });
    yield put({ type: actions.GET_PROFILE })
  } catch (error) {
    notification.error({ message: error?.message || "Đăng nhập không thành công!" });
    yield put({ type: actions.LOGIN_FAIL, payload: { error } });
  }
}

async function loginFirebase(email, password) {
  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  try {
    const userInfo = await getUserByUid(user.uid)
    if (!userInfo.isActive) {
      return Promise.reject({ message: "Đăng nhập không thành công do tài khoản đang bị tạm khoá!" })
    }
  } catch (error) {
    return Promise.reject({ message: "Đăng nhập không thành công!" })
  }
  const token = await user.getIdToken(true)
  authHelper.saveToken(token)
  return token
}

function* getProfile() {
  try {
    const { user_id } = yield authHelper.getTokenParse()
    const userProfile = yield getUserByUid(user_id)
    if (!userProfile.isActive) {
      throw Promise.reject({ message: "Tải thông tin cá nhân không thành công!" })
    }
    yield put({
      type: actions.GET_PROFILE_SUCCESS,
      payload: userProfile
    });
  } catch (error) {
    notification.error({ message: "Tải thông tin cá nhân không thành công!" });
    yield put({ type: actions.GET_PROFILE_FAIL, payload: { error } });
    yield put({ type: actions.LOGOUT });
  }
}

function* logout(data) {
  yield call(authHelper.destroyToken.bind(this));
}

export default function* watchAuthAsync() {
  yield takeLatest(actions.SIGNUP, signup);
  yield takeLatest(actions.LOGIN, login);
  yield takeLatest(actions.GET_PROFILE, getProfile);
  yield takeLatest(actions.LOGOUT, logout);
}
