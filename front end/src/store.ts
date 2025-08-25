import { configureStore } from '@reduxjs/toolkit'
import  clientSliceReducer  from './features/clientSlice'
import UserSliceReducer from './features/userSlice'
import { useDispatch } from 'react-redux'
import {  useSelector, TypedUseSelectorHook } from 'react-redux';


export const store =configureStore({

reducer:{
    clients :clientSliceReducer,
    users:UserSliceReducer
}

})


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()