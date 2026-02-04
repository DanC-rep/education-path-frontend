import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { ActionReducerMapBuilder } from '@reduxjs/toolkit/react'
import { createAppAsyncThunk } from '../../../shared/redux'
import { getErrorMessage } from '../../../shared/utils/getErrorMessage'
import { authApi, LoginResponse } from '../authApi'
import { AuthState } from '../authSlice'

export const loginThunk = createAppAsyncThunk<LoginResponse, { email: string; password: string }>(
   'auth/login',
   async (request, { dispatch, rejectWithValue, extra }) => {
      try {
         const response = await dispatch(authApi.endpoints.login.initiate(request)).unwrap()

         extra.router.navigate('/')

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const loginCases = (builder: ActionReducerMapBuilder<AuthState>) => {
   builder
      .addCase(loginThunk.pending, state => {
         state.fetchStatus = 'loading'
         state.loginError = undefined
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
         state.accessToken = payload.accessToken
         state.refreshToken = payload.refreshToken
         state.userId = payload.user.id
         state.roles = payload.user.roles
         state.isAuthenticated = true
         state.fetchStatus = 'succeeded'
         state.loginError = undefined
      })
      .addCase(loginThunk.rejected, (state, action) => {
         state.fetchStatus = 'failed'
         state.loginError = action.payload
      })
}
