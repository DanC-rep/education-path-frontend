import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../../shared/redux'
import { getErrorMessage } from '../../../shared/utils/getErrorMessage'
import { authApi, RegisterResponse } from '../authApi'
import { AuthState } from '../authSlice'

export const registerThunk = createAppAsyncThunk<
   RegisterResponse,
   {
      email: string
      userName: string
      fullName: { name: string; surname: string; patronymic: string }
      password: string
   }
>('auth/register', async (request, { dispatch, rejectWithValue, extra }) => {
   try {
      const response = await dispatch(authApi.endpoints.register.initiate(request)).unwrap()

      extra.router.navigate('/')

      return response
   } catch (error) {
      const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
      return rejectWithValue(errorMessage)
   }
})

export const registerCases = (builder: ActionReducerMapBuilder<AuthState>) => {
   builder
      .addCase(registerThunk.pending, state => {
         state.fetchStatus = 'loading'
         state.registrationError = undefined
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
         state.accessToken = payload.accessToken
         state.refreshToken = payload.refreshToken
         state.userId = payload.user.id
         state.roles = payload.user.roles
         state.isAuthenticated = true
         state.fetchStatus = 'succeeded'
         state.registrationError = undefined
      })
      .addCase(registerThunk.rejected, (state, action) => {
         state.fetchStatus = 'failed'
         state.registrationError = action.payload
      })
}
