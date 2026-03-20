import { baseApi } from '../../shared/api/baseApi'
import { Envelope } from '../../shared/models/Envelope'

export type RoleDto = {
   id: string
   name: string
}

export type AccountDto = {
   id: string
   userId: string
}

export type UserProfile = {
   id: string
   name: string
   surname: string
   patronymic: string
   userName: string
   roles: RoleDto[]
   studentAccount?: AccountDto | null
   adminAccount?: AccountDto | null
}

export type UpdateUserRequest = {
   userId: string
   fullName: {
      name: string
      surname: string
      patronymic: string
   }
}

export const userApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      getUser: builder.query<UserProfile, string>({
         query: userId => ({
            url: `/accounts/${userId}`,
            method: 'GET',
         }),
         providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
         transformResponse: (res: Envelope<UserProfile>) => res.result!,
      }),
      updateUser: builder.mutation<void, UpdateUserRequest>({
         query: ({ userId, fullName }) => ({
            url: `/accounts/${userId}`,
            method: 'PUT',
            body: { fullName },
         }),
         invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
      }),
   }),
})

export const { useGetUserQuery, useUpdateUserMutation } = userApi
