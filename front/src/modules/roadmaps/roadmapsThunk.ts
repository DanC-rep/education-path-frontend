import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../shared/redux'
import { getErrorMessage } from '../../shared/utils/getErrorMessage'
import { roadmapApi, RoadmapDetails, RoadmapsResponse } from './roadmapApi'
import { RoadmapsState } from './roadmapSlice'

export const getUserRoadmapsThunk = createAppAsyncThunk<RoadmapsResponse, string>(
   'roadmaps/getUserRoadmaps',
   async (userId, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(roadmapApi.endpoints.getUserRoadmaps.initiate(userId)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const getRoadmapByIdThunk = createAppAsyncThunk<RoadmapDetails, string>(
   'roadmaps/getRoadmapById',
   async (roadmapId, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(roadmapApi.endpoints.getRoadmapById.initiate(roadmapId)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const roadmapsCases = (builder: ActionReducerMapBuilder<RoadmapsState>) => {
   builder
      .addCase(getUserRoadmapsThunk.pending, state => {
         state.fetchStatus = 'loading'
         state.error = undefined
      })
      .addCase(getUserRoadmapsThunk.fulfilled, (state, { payload }) => {
         state.fetchStatus = 'succeeded'
         state.roadmaps = payload.roadmaps
         state.error = undefined
      })
      .addCase(getUserRoadmapsThunk.rejected, (state, action) => {
         state.fetchStatus = 'failed'
         state.error = action.payload
      })
      .addCase(getRoadmapByIdThunk.pending, state => {
         state.currentFetchStatus = 'loading'
         state.currentError = undefined
      })
      .addCase(getRoadmapByIdThunk.fulfilled, (state, { payload }) => {
         state.currentFetchStatus = 'succeeded'
         state.currentRoadmap = payload
         state.currentError = undefined
      })
      .addCase(getRoadmapByIdThunk.rejected, (state, action) => {
         state.currentFetchStatus = 'failed'
         state.currentError = action.payload
      })
}
