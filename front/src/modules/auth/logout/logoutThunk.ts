import { baseApi } from '../../../shared/api/baseApi'
import { createAppAsyncThunk } from '../../../shared/redux'
import { authApi } from '../authApi'
import { authActions } from '../authSlice'

export const logoutThunk = createAppAsyncThunk<void, void>('auth/logout', async (_, { dispatch, getState, extra }) => {
   const userId = getState().auth.userId

   if (userId) {
      try {
         await dispatch(authApi.endpoints.logout.initiate({ userId })).unwrap()
      } catch {
         // Keep local logout flow even if backend logout request fails.
      }
   }

   dispatch(baseApi.util.resetApiState())
   dispatch(authActions.logOut())
   extra.router.navigate('/login')
})
