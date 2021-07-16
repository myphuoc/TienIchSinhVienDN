import { call, put, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import actions from "./actions";
import postApi from "api/postApi";

function* getSharedPosts() {
  try {
    const data = yield call(_getSharedPosts.bind(this));
    yield put({ type: actions.GET_SHARED_POSTS_SUCCESS, payload: data });
  } catch (error) {
    notification.error({ message: "Tải bài viết gần đây thất bại!" });
    yield put({ type: actions.GET_SHARED_POSTS_FAIL, payload: { error } });
  }
}

async function _getSharedPosts() {
  return await postApi.getPosts()
}

export default function* watchSharedPostsAsync() {
  yield takeLatest(actions.GET_SHARED_POSTS, getSharedPosts);
}
