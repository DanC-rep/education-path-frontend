import { createSlice } from '@reduxjs/toolkit'
import { RoadmapDetails, RoadmapSummary } from './roadmapApi'
import { roadmapsCases } from './roadmapsThunk'

export type RoadmapsState = {
   roadmaps: RoadmapSummary[]
   fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   error: string | undefined
   currentRoadmap: RoadmapDetails | undefined
   currentFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
   currentError: string | undefined
}

const initialState: RoadmapsState = {
   roadmaps: [],
   fetchStatus: 'idle',
   error: undefined,
   currentRoadmap: undefined,
   currentFetchStatus: 'idle',
   currentError: undefined,
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
   },
   extraReducers: builder => {
      roadmapsCases(builder)
   },
})

export const roadmapsActions = roadmapsSlice.actions
export const roadmapsSelectors = roadmapsSlice.selectors

export default roadmapsSlice.reducer
