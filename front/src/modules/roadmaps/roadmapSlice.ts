import { createSlice } from '@reduxjs/toolkit'
import { RoadmapDetails, RoadmapSummary, LessonDetails, Skill } from './roadmapApi'
import { roadmapsCases } from './roadmapsThunk'

export type RoadmapsState = {
   roadmaps: RoadmapSummary[]
   fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   error: string | undefined
   currentRoadmap: RoadmapDetails | undefined
   currentFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   currentError: string | undefined
   currentLesson: LessonDetails | undefined
   currentLessonFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   currentLessonError: string | undefined
   skills: Skill[]
   skillsFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   skillsError: string | undefined
   createRoadmapStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   createRoadmapError: string | undefined
}

const initialState: RoadmapsState = {
   roadmaps: [],
   fetchStatus: 'idle',
   error: undefined,
   currentRoadmap: undefined,
   currentFetchStatus: 'idle',
   currentError: undefined,
   currentLesson: undefined,
   currentLessonFetchStatus: 'idle',
   currentLessonError: undefined,
   skills: [],
   skillsFetchStatus: 'idle',
   skillsError: undefined,
   createRoadmapStatus: 'idle',
   createRoadmapError: undefined,
}

export const roadmapsSlice = createSlice({
   name: 'roadmaps',
   initialState,
   selectors: {
      selectRoadmaps: state => state.roadmaps,
      selectRoadmapsStatus: state => state.fetchStatus,
      selectRoadmapsError: state => state.error,
      selectCurrentRoadmap: state => state.currentRoadmap,
      selectCurrentRoadmapStatus: state => state.currentFetchStatus,
      selectCurrentRoadmapError: state => state.currentError,
      selectCurrentLesson: state => state.currentLesson,
      selectCurrentLessonStatus: state => state.currentLessonFetchStatus,
      selectCurrentLessonError: state => state.currentLessonError,
      selectSkills: state => state.skills,
      selectSkillsFetchStatus: state => state.skillsFetchStatus,
      selectSkillsError: state => state.skillsError,
      selectCreateRoadmapStatus: state => state.createRoadmapStatus,
      selectCreateRoadmapError: state => state.createRoadmapError,
   },
   reducers: {
      clearRoadmaps: state => {
         state.roadmaps = []
         state.fetchStatus = 'idle'
         state.error = undefined
      },
      clearCurrentRoadmap: state => {
         state.currentRoadmap = undefined
         state.currentFetchStatus = 'idle'
         state.currentError = undefined
      },
      clearCurrentLesson: state => {
         state.currentLesson = undefined
         state.currentLessonFetchStatus = 'idle'
         state.currentLessonError = undefined
      },
      clearCreateRoadmapStatus: state => {
         state.createRoadmapStatus = 'idle'
         state.createRoadmapError = undefined
      },
   },
   extraReducers: builder => {
      roadmapsCases(builder)
   },
})

export const roadmapsActions = roadmapsSlice.actions
export const roadmapsSelectors = roadmapsSlice.selectors

export default roadmapsSlice.reducer
