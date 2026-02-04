import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AppState } from '../redux'
import { Envelope } from '../models/Envelope'
import { RefreshResponse } from '../../modules/auth/authApi'
import { Mutex } from 'async-mutex'
import { authActions } from '../../modules/auth/authSlice'

const BASE_URL = 'http://localhost:5005/api/'

const baseQuery = fetchBaseQuery({
   baseUrl: BASE_URL,
   credentials: 'include',
   prepareHeaders: (headers, { getState }) => {
      const state = getState() as AppState

      const accessToken = state.auth.accessToken

      if (accessToken) {
         headers.set('authorization', `Bearer ${accessToken}`)
      }

      return headers
   },
})

const mutex = new Mutex()

const baseQueryWithRefresh: typeof baseQuery = async (args, api, extraOptions) => {
   await mutex.waitForUnlock()
   let result = await baseQuery(args, api, extraOptions)

   if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
         const release = await mutex.acquire()

         try {
            const state = api.getState() as AppState
            const refreshToken = state.auth.refreshToken

            if (!refreshToken) {
               api.dispatch(authActions.logOut())
            } else {
               const authResponse = await baseQuery(
                  {
                     url: '/accounts/refresh',
                     method: 'POST',
                     body: { refreshToken },
                  },
                  api,
                  extraOptions,
               )

               if (authResponse.data) {
                  const data = authResponse.data as Envelope<RefreshResponse>

                  api.dispatch(
                     authActions.tokenReceived({
                        accessToken: data.result!.accessToken,
                        refreshToken: data.result!.refreshToken,
                        userId: data.result!.user.id,
                        roles: data.result!.user.roles,
                     }),
                  )

                  result = await baseQuery(args, api, extraOptions)
               } else {
                  api.dispatch(authActions.logOut())
               }
            }
         } finally {
            release()
         }
      } else {
         await mutex.waitForUnlock()
         result = await baseQuery(args, api, extraOptions)
      }
   }

   return result
}

export const baseApi = createApi({
   baseQuery: baseQueryWithRefresh,
   endpoints: () => ({}),
})
