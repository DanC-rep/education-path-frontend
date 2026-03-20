import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { createAppAsyncThunk } from '../../shared/redux'
import { getErrorMessage } from '../../shared/utils/getErrorMessage'
import { testApi, CreateTestRequest, CreateTestResponse, TestDetails, SubmitTestAnswersRequest } from './testApi'

export const submitTestAnswersThunk = createAppAsyncThunk<void, SubmitTestAnswersRequest>(
   'tests/submitAnswers',
   async (data, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(testApi.endpoints.submitTestAnswers.initiate(data)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const getTestByIdThunk = createAppAsyncThunk<TestDetails, string>(
   'tests/getTestById',
   async (testId, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(testApi.endpoints.getTestById.initiate(testId)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const createTestThunk = createAppAsyncThunk<CreateTestResponse, CreateTestRequest>(
   'tests/createTest',
   async (data, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(testApi.endpoints.createTest.initiate(data)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)
