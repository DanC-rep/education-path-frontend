import { Envelope } from '../../shared/models/Envelope'
import { baseApi } from '../../shared/api/baseApi'
import { Role } from './authSlice'

export type LoginResponse = {
   accessToken: string
   refreshToken: string
   user: {
      id: string
      email: string
      userName: string
      roles: Role[]
   }
}

export type RegisterRequest = {
   email: string
   userName: string
   fullName: {
      name: string
      surname: string
      patronymic: string
   }
   password: string
}

export type RegisterResponse = {
   accessToken: string
   refreshToken: string
   user: {
      id: string
      email: string
      userName: string
      roles: Role[]
   }
}

export type RefreshResponse = RegisterResponse

export const authApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      login: builder.mutation<LoginResponse, { email: string; password: string }>({
         query: ({ email, password }) => ({
            url: '/accounts/login',
            body: { email, password },
            method: 'POST',
         }),
         transformResponse: (res: Envelope<LoginResponse>) => {
            return res.result!
         },
      }),
      register: builder.mutation<RegisterResponse, RegisterRequest>({
         query: body => ({
            url: '/accounts/registration',
            body,
            method: 'POST',
         }),
         transformResponse: (res: Envelope<RegisterResponse>) => res.result!,
      }),
      refreshToken: builder.mutation<RefreshResponse, { refreshToken: string }>({
         query: body => ({
            url: '/accounts/refresh',
            body,
            method: 'POST',
         }),
         transformResponse: (res: Envelope<RefreshResponse>) => res.result!,
      }),
   }),
})

export const { useLoginMutation, useRefreshTokenMutation, useRegisterMutation } = authApi
