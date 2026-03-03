import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../shared/redux'
import { getErrorMessage } from '../../shared/utils/getErrorMessage'
import {
   roadmapApi,
   RoadmapDetails,
   RoadmapsResponse,
   LessonDetails,
   SkillsResponse,
   CreateRoadmapRequest,
   CreateRoadmapResponse,
} from './roadmapApi'
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

export const getLessonByIdThunk = createAppAsyncThunk<LessonDetails, string>(
   'roadmaps/getLessonById',
   async (lessonId, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(roadmapApi.endpoints.getLessonById.initiate(lessonId)).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const getSkillsThunk = createAppAsyncThunk<SkillsResponse, void>(
   'roadmaps/getSkills',
   async (_, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(roadmapApi.endpoints.getSkills.initiate()).unwrap()

         return response
      } catch (error) {
         const errorMessage = getErrorMessage(error as FetchBaseQueryError | undefined)
         return rejectWithValue(errorMessage)
      }
   },
)

export const createRoadmapThunk = createAppAsyncThunk<CreateRoadmapResponse, CreateRoadmapRequest>(
   'roadmaps/createRoadmap',
   async (data, { dispatch, rejectWithValue }) => {
      try {
         const response = await dispatch(roadmapApi.endpoints.createRoadmap.initiate(data)).unwrap()

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
      .addCase(getLessonByIdThunk.pending, state => {
         state.currentLessonFetchStatus = 'loading'
         state.currentLessonError = undefined
      })
      .addCase(getLessonByIdThunk.fulfilled, (state, { payload }) => {
         state.currentLessonFetchStatus = 'succeeded'
         state.currentLesson = payload
         state.currentLessonError = undefined
      })
      .addCase(getLessonByIdThunk.rejected, (state, action) => {
         state.currentLessonFetchStatus = 'failed'
         state.currentLessonError = action.payload
      })
      .addCase(getSkillsThunk.pending, state => {
         state.skillsFetchStatus = 'loading'
         state.skillsError = undefined
      })
      .addCase(getSkillsThunk.fulfilled, (state, { payload }) => {
         state.skillsFetchStatus = 'succeeded'
         state.skills = payload.skills
         state.skillsError = undefined
      })
      .addCase(getSkillsThunk.rejected, (state, action) => {
         state.skillsFetchStatus = 'failed'
         state.skillsError = action.payload
      })
      .addCase(createRoadmapThunk.pending, state => {
         state.createRoadmapStatus = 'loading'
         state.createRoadmapError = undefined
      })
      .addCase(createRoadmapThunk.fulfilled, state => {
         state.createRoadmapStatus = 'succeeded'
         state.createRoadmapError = undefined
      })
      .addCase(createRoadmapThunk.rejected, (state, action) => {
         state.createRoadmapStatus = 'failed'
         state.createRoadmapError = action.payload
      })
}
