import { createSlice } from '@reduxjs/toolkit'
import { TestDetails } from './testApi'
import { createTestThunk, getTestByIdThunk, submitTestAnswersThunk } from './testThunk'

export type TestsState = {
   createTestStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   createTestError: string | undefined
   currentTest: TestDetails | undefined
   currentTestStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   currentTestError: string | undefined
   submitTestStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   submitTestError: string | undefined
}

const initialState: TestsState = {
   createTestStatus: 'idle',
   createTestError: undefined,
   currentTest: undefined,
   currentTestStatus: 'idle',
   currentTestError: undefined,
   submitTestStatus: 'idle',
   submitTestError: undefined,
}

export const testsSlice = createSlice({
   name: 'tests',
   initialState,
   selectors: {
      selectCreateTestStatus: state => state.createTestStatus,
      selectCreateTestError: state => state.createTestError,
      selectCurrentTest: state => state.currentTest,
      selectCurrentTestStatus: state => state.currentTestStatus,
      selectCurrentTestError: state => state.currentTestError,
      selectSubmitTestStatus: state => state.submitTestStatus,
      selectSubmitTestError: state => state.submitTestError,
   },
   reducers: {
      clearCreateTestStatus: state => {
         state.createTestStatus = 'idle'
         state.createTestError = undefined
      },
      clearCurrentTest: state => {
         state.currentTest = undefined
         state.currentTestStatus = 'idle'
         state.currentTestError = undefined
      },
      clearSubmitTestStatus: state => {
         state.submitTestStatus = 'idle'
         state.submitTestError = undefined
      },
   },
   extraReducers: builder => {
      builder
         .addCase(getTestByIdThunk.pending, state => {
            state.currentTestStatus = 'loading'
            state.currentTestError = undefined
         })
         .addCase(getTestByIdThunk.fulfilled, (state, { payload }) => {
            state.currentTestStatus = 'succeeded'
            state.currentTest = payload
            state.currentTestError = undefined
         })
         .addCase(getTestByIdThunk.rejected, (state, action) => {
            state.currentTestStatus = 'failed'
            state.currentTestError = action.payload
         })
         .addCase(submitTestAnswersThunk.pending, state => {
            state.submitTestStatus = 'loading'
            state.submitTestError = undefined
         })
         .addCase(submitTestAnswersThunk.fulfilled, state => {
            state.submitTestStatus = 'succeeded'
            state.submitTestError = undefined
         })
         .addCase(submitTestAnswersThunk.rejected, (state, action) => {
            state.submitTestStatus = 'failed'
            state.submitTestError = action.payload
         })
         .addCase(createTestThunk.pending, state => {
            state.createTestStatus = 'loading'
            state.createTestError = undefined
         })
         .addCase(createTestThunk.fulfilled, state => {
            state.createTestStatus = 'succeeded'
            state.createTestError = undefined
         })
         .addCase(createTestThunk.rejected, (state, action) => {
            state.createTestStatus = 'failed'
            state.createTestError = action.payload
         })
   },
})

export const testsActions = testsSlice.actions
export const testsSelectors = testsSlice.selectors

export default testsSlice.reducer
