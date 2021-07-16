import actions from "./actions";

const initState = {
  loading: false,
  posts: [],
  errors: {},
}

export default function sharedPostsReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case actions.GET_SHARED_POSTS:
      return {
        ...state,
        loading: true,
      };
    case actions.GET_SHARED_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: payload
      };
    case actions.GET_SHARED_POSTS_FAIL:
      return {
        ...state,
        loading: false,
        errors: payload.error,
      };

    default:
      return state;
  }
}
