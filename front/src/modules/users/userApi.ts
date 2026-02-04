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

export const userApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      getUser: builder.query<UserProfile, string>({
         query: userId => ({
            url: `/accounts/${userId}`,
            method: 'GET',
         }),
         transformResponse: (res: Envelope<UserProfile>) => res.result!,
      }),
   }),
})

export const { useGetUserQuery } = userApi
