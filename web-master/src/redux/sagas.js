import { all, fork } from "redux-saga/effects";
import auth from "./auth/saga";
import watchSharedPosts from "./sharedPosts/saga";

export default function* sagas() {
  yield all([
    fork(auth),
    fork(watchSharedPosts),
  ]);
}
