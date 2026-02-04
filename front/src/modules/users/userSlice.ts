import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProfile } from './userApi'

export type UsersState = {
   currentUser: UserProfile | undefined
   fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   error: string | undefined
}

const initialState: UsersState = {
   currentUser: undefined,
   fetchStatus: 'idle',
   error: undefined,
}

export const usersSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      userLoading: state => {
         state.fetchStatus = 'loading'
         state.error = undefined
      },
      userLoaded: (state, action: PayloadAction<UserProfile>) => {
         state.currentUser = action.payload
         state.fetchStatus = 'succeeded'
      },
      userLoadFailed: (state, action: PayloadAction<string | undefined>) => {
         state.error = action.payload
         state.fetchStatus = 'failed'
      },
      clearUser: state => {
         state.currentUser = undefined
         state.fetchStatus = 'idle'
         state.error = undefined
      },
   },
})

export const usersActions = usersSlice.actions
export default usersSlice.reducer
