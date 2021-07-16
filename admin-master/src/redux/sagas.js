import { all, fork } from "redux-saga/effects";
import auth from "./auth/saga";

export default function* sagas() {
  yield all([
    fork(auth),
  ]);
}
