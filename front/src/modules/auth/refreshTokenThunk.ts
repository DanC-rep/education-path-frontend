import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi, RefreshResponse } from './authApi'
import { AppState } from '../../shared/redux'
import { AuthState } from './authSlice'

export const refreshTokenThunk = createAsyncThunk<RefreshResponse, void, { state: AppState }>(
   'auth/refresh',
   async (_, { dispatch, rejectWithValue, getState }) => {
      try {
         const state = getState()
         const refreshToken = state.auth.refreshToken

         if (!refreshToken) {
            return rejectWithValue('No refresh token')
         }

         const result = await dispatch(authApi.endpoints.refreshToken.initiate({ refreshToken })).unwrap()
         return result
      } catch (error) {
         return rejectWithValue(error)
      }
   },
)

export const refreshTokenCases = (builder: ActionReducerMapBuilder<AuthState>) => {
   builder
      .addCase(refreshTokenThunk.pending, state => {
         state.fetchStatus = 'loading'
      })
      .addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
         state.accessToken = payload.accessToken
         state.userId = payload.user.id
         state.roles = payload.user.roles
         state.isAuthenticated = true
         state.fetchStatus = 'succeeded'
      })
      .addCase(refreshTokenThunk.rejected, state => {
         state.accessToken = undefined
         state.userId = undefined
         state.isAuthenticated = false
         state.fetchStatus = 'idle'
      })
}
