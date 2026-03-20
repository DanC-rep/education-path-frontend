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

export type LessonLink = {
   id: string
   title: string
}

export type LessonDetails = {
   id: string
   title: string
   content: string
   isCompleted: boolean
   type: LessonType
   testId: string | null
   links: string[]
   nextLessons: LessonLink[]
   previousLessons: LessonLink[]
}

export type LessonQuestionRequest = {
   lessonId: string
   question: string
}

export type LessonQuestionResponse = {
   answer: string
}

export type Skill = {
   id: string
   parentId: string | null
   name: string
   description: string
   children: Skill[] | null
}

export type SkillsResponse = {
   skills: Skill[]
}

export type CreateRoadmapRequest = {
   skillsIds: string[]
   userId: string
   level: number
   userAdditionalData?: string
}

export type CreateRoadmapResponse = {
   id: string
   title: string
}

export const roadmapApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      getUserRoadmaps: builder.query<RoadmapsResponse, string>({
         query: userId => ({
            url: `LearningPaths/roadmaps/user/${userId}`,
            method: 'GET',
         }),
         providesTags: ['Roadmaps'],
         transformResponse: (res: Envelope<RoadmapsResponse>) => res.result!,
      }),
      getRoadmapById: builder.query<RoadmapDetails, string>({
         query: roadmapId => ({
            url: `LearningPaths/roadmaps/${roadmapId}`,
            method: 'GET',
         }),
         providesTags: (_result, _error, roadmapId) => [
            { type: 'RoadmapDetails', id: roadmapId },
            { type: 'RoadmapDetails', id: 'LIST' },
         ],
         transformResponse: (res: Envelope<RoadmapDetails>) => res.result!,
      }),
      getLessonById: builder.query<LessonDetails, string>({
         query: lessonId => ({
            url: `LearningPaths/roadmaps/lesson/${lessonId}`,
            method: 'GET',
         }),
         providesTags: (_result, _error, lessonId) => [
            { type: 'LessonDetails', id: lessonId },
            { type: 'LessonDetails', id: 'LIST' },
         ],
         transformResponse: (res: Envelope<LessonDetails>) => res.result!,
      }),
      askLessonQuestion: builder.mutation<LessonQuestionResponse, LessonQuestionRequest>({
         query: ({ lessonId, question }) => ({
            url: `LearningPaths/roadmaps/lesson/${lessonId}/question`,
            method: 'GET',
            params: { question },
         }),
         transformResponse: (res: Envelope<LessonQuestionResponse>) => res.result!,
      }),
      getSkills: builder.query<SkillsResponse, void>({
         query: () => ({
            url: 'Skills/skills',
            method: 'GET',
         }),
         transformResponse: (res: Envelope<SkillsResponse>) => res.result!,
      }),
      createRoadmap: builder.mutation<CreateRoadmapResponse, CreateRoadmapRequest>({
         query: data => ({
            url: 'LearningPaths/roadmaps',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['Roadmaps'],
         transformResponse: (res: Envelope<CreateRoadmapResponse>) => res.result!,
      }),
      completeLesson: builder.mutation<void, string>({
         query: lessonId => ({
            url: `LearningPaths/roadmaps/lesson/${lessonId}/complete`,
            method: 'PUT',
         }),
         invalidatesTags: (_result, _error, lessonId) => [
            'Roadmaps',
            { type: 'RoadmapDetails', id: 'LIST' },
            { type: 'LessonDetails', id: lessonId },
            { type: 'LessonDetails', id: 'LIST' },
         ],
      }),
   }),
})

export const {
   useGetUserRoadmapsQuery,
   useGetRoadmapByIdQuery,
   useGetLessonByIdQuery,
   useAskLessonQuestionMutation,
   useGetSkillsQuery,
   useCreateRoadmapMutation,
   useCompleteLessonMutation,
} = roadmapApi
