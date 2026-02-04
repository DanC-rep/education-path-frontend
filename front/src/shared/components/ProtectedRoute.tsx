import { PropsWithChildren } from 'react'
import { useAppSelector } from '../redux'
import { Role } from '../../modules/auth/authSlice'
import { authSelectors } from '../../modules/auth/authSlice'
import { Navigate } from 'react-router'

type Props = {
   roles: Role[]
} & PropsWithChildren

export function ProtectedRoute({ children, roles }: Props) {
   const authStatus = useAppSelector(authSelectors.selectAuthFetchStatus)
   const isAuthenticated = useAppSelector(authSelectors.selectIsAuthenticated)
   const userRoles = useAppSelector(authSelectors.selectCurrentUserRoles)

   if (authStatus === 'loading') return <div>Загрузка...</div>

   if (!isAuthenticated)
      return <Navigate to='/login'/>

   const hasAccess = isAuthenticated && roles.some(role => userRoles.includes(role))

   if (!hasAccess) {
      return <div>Доступ запрещен</div>
   }

   return children
}