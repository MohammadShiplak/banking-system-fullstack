import { configureStore } from "@reduxjs/toolkit";
import clientSliceReducer from "./features/clientSlice";
import UserSliceReducer from "./features/userSlice";
import { useDispatch } from "react-redux";
import { useSelector, TypedUseSelectorHook } from "react-redux";

import { injectStore } from "./API/axiosInstance";

export const store = configureStore({
  reducer: {
    clients: clientSliceReducer,
    users: UserSliceReducer,
  },
});
// 2. INJECT THE STORE INTO AXIOS
// This gives Axios access to getState() and dispatch() without circular loops!
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
