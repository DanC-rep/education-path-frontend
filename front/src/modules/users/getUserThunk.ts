import { createAppAsyncThunk } from '../../shared/redux'
import { userApi } from './userApi'
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
