const actions = {
  GET_SHARED_POSTS: "sharedPosts/GET_SHARED_POSTS",
  GET_SHARED_POSTS_SUCCESS: "sharedPosts/GET_SHARED_POSTS_SUCCESS",
  GET_SHARED_POSTS_FAIL: "sharedPosts/GET_SHARED_POSTS_FAIL",
};

export default actions;

export const getSharedPosts = { type: actions.GET_SHARED_POSTS }