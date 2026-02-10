import { baseApi } from '../../shared/api/baseApi'
import { Envelope } from '../../shared/models/Envelope'

export type RoadmapLevel = 'Beginning' | 'Basic' | 'Advanced'

export type LessonType = 'Required' | 'Optional' | 'Recommended'

export type RoadmapSummary = {
   id: string
   title: string
   descriptions: string
   level: RoadmapLevel
}

export type RoadmapsResponse = {
   roadmaps: RoadmapSummary[]
}

export type RoadmapLesson = {
   id: string
   title: string
   isCompleted: boolean
   type: LessonType
   nextLessons: string[]
   prevLessons: string[]
}

export type RoadmapDetails = {
   id: string
   title: string
   description: string
   level: RoadmapLevel
   lessons: RoadmapLesson[]
}

export const roadmapApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      getUserRoadmaps: builder.query<RoadmapsResponse, string>({
         query: userId => ({
            url: `LearningPaths/roadmaps/user/${userId}`,
            method: 'GET',
         }),
         transformResponse: (res: Envelope<RoadmapsResponse>) => res.result!,
      }),
      getRoadmapById: builder.query<RoadmapDetails, string>({
         query: roadmapId => ({
            url: `LearningPaths/roadmaps/${roadmapId}`,
            method: 'GET',
         }),
         transformResponse: (res: Envelope<RoadmapDetails>) => res.result!,
      }),
   }),
})

export const { useGetUserRoadmapsQuery, useGetRoadmapByIdQuery } = roadmapApi
