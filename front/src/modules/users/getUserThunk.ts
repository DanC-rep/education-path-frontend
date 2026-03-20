import { createAppAsyncThunk } from '../../shared/redux'
import { userApi, UpdateUserRequest } from './userApi'
import { usersActions } from './userSlice'
import { getErrorMessage } from '../../shared/utils/getErrorMessage'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const getUserThunk = createAppAsyncThunk<void, string>(
   'users/getUser',
   async (userId, { dispatch, rejectWithValue }) => {
      dispatch(usersActions.userLoading())

      try {
         const response = await dispatch(userApi.endpoints.getUser.initiate(userId)).unwrap()

         dispatch(usersActions.userLoaded(response))
      } catch (err) {
         const errorMessage = getErrorMessage(err as FetchBaseQueryError | undefined)
         dispatch(usersActions.userLoadFailed(errorMessage))
         return rejectWithValue(errorMessage)
      }
   },
)

export const updateUserThunk = createAppAsyncThunk<void, UpdateUserRequest>(
   'users/updateUser',
   async (payload, { dispatch, rejectWithValue }) => {
      dispatch(usersActions.userUpdateLoading())

      try {
         await dispatch(userApi.endpoints.updateUser.initiate(payload)).unwrap()
         dispatch(usersActions.userUpdateSucceeded())
         await dispatch(getUserThunk(payload.userId))
      } catch (err) {
         const errorMessage = getErrorMessage(err as FetchBaseQueryError | undefined)
         dispatch(usersActions.userUpdateFailed(errorMessage))
         return rejectWithValue(errorMessage)
      }
   },
)
