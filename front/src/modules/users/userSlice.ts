import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProfile } from './userApi'

export type UsersState = {
   currentUser: UserProfile | undefined
   fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   error: string | undefined
   updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   updateError: string | undefined
}

const initialState: UsersState = {
   currentUser: undefined,
   fetchStatus: 'idle',
   error: undefined,
   updateStatus: 'idle',
   updateError: undefined,
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
      userUpdateLoading: state => {
         state.updateStatus = 'loading'
         state.updateError = undefined
      },
      userUpdateSucceeded: state => {
         state.updateStatus = 'succeeded'
         state.updateError = undefined
      },
      userUpdateFailed: (state, action: PayloadAction<string | undefined>) => {
         state.updateStatus = 'failed'
         state.updateError = action.payload
      },
      clearUpdateStatus: state => {
         state.updateStatus = 'idle'
         state.updateError = undefined
      },
      clearUser: state => {
         state.currentUser = undefined
         state.fetchStatus = 'idle'
         state.error = undefined
         state.updateStatus = 'idle'
         state.updateError = undefined
      },
   },
})

export const usersActions = usersSlice.actions
export default usersSlice.reducer
