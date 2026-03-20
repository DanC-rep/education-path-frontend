import { configureStore } from '@reduxjs/toolkit/react'
import { baseApi } from '../shared/api/baseApi'
import { router } from './Router'
import authReducer from '../modules/auth/authSlice'
import usersReducer from '../modules/users/userSlice'
import roadmapsReducer from '../modules/roadmaps/roadmapSlice'
import testsReducer from '../modules/tests/testSlice'

export const extraArgument = {
   router,
}

export const store = configureStore({
   reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      users: usersReducer,
      roadmaps: roadmapsReducer,
      tests: testsReducer,
   },
   middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: { extraArgument } }).concat(baseApi.middleware),
})
