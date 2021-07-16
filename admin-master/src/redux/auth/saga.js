import { call, put, takeLatest } from "redux-saga/effects";
import firebase, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { notification } from "antd";

import actions from "./actions";
import authHelper from "../../helpers/AuthHelper";
import constants from "../../constants";

async function getUserByUid(uid) {
  const doc = await firestore().collection("users").doc(uid).get()
  if (!doc.exists) {
    return Promise.reject({ message: "Tải thông tin cá nhân không thành công!" })
  } else {
    return doc.data()
  }
}

function* login(data) {
  const { email, password } = data.payload;
  try {
    const token = yield call(loginFirebase.bind(this, email, password));
    yield put({ type: actions.LOGIN_SUCCESS, payload: token });
    yield put({ type: actions.GET_PROFILE })
  } catch (error) {
    notification.error({ message: "Đăng nhập không thành công!" });
    yield put({ type: actions.LOGIN_FAIL, payload: { error } });
  }
}

async function loginFirebase(email, password) {
  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);

  await firestore()
    .collection(constants.COLLECTION.USER)
    .doc(user.uid)
    .get()
    .then(snapshot => {
      const { isAdmin } = snapshot.data()
      if (!isAdmin) return Promise.reject({ message: "Bạn không được phép truy cập!" })
    })

  const token = await user.getIdToken(true)
  authHelper.saveToken(token)
  return token
}

function* getProfile() {
  try {
    const { user_id } = yield authHelper.getTokenParse()
    const userProfile = yield getUserByUid(user_id)
    yield put({
      type: actions.GET_PROFILE_SUCCESS,
      payload: userProfile
    });
  } catch (error) {
    notification.error({ message: "Tải thông tin cá nhân không thành công!" });
    yield put({ type: actions.GET_PROFILE_FAIL, payload: { error } });
  }
}

function* logout() {
  yield call(authHelper.destroyToken.bind(this));
}

export default function* watchAuthAsync() {
  yield takeLatest(actions.LOGIN, login);
  yield takeLatest(actions.GET_PROFILE, getProfile);
  yield takeLatest(actions.LOGOUT, logout);
}
