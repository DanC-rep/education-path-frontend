import { baseApi } from '../../shared/api/baseApi'
import { Envelope } from '../../shared/models/Envelope'

export type CreateTestRequest = {
   lessonId: string
}

export type CreateTestResponse = string

export type TestAnswer = {
   id: string
   title: string
   isCorrect: boolean
}

export type TestQuestion = {
   id: string
   title: string
   isCorrectAnswer: boolean | null
   answers: TestAnswer[]
}

export type TestDetails = {
   id: string
   title: string
   description: string
   isCompleted: boolean
   questions: TestQuestion[]
}

export type SubmitTestAnswerItem = {
   questionId: string
   answerId: string
}

export type SubmitTestAnswersRequest = {
   testId: string
   answers: SubmitTestAnswerItem[]
}

export const testApi = baseApi.injectEndpoints({
   endpoints: builder => ({
      getTestById: builder.query<TestDetails, string>({
         query: testId => ({
            url: `Tests/${testId}`,
            method: 'GET',
         }),
         providesTags: (_result, _error, testId) => [
            { type: 'Tests', id: testId },
            { type: 'Tests', id: 'LIST' },
         ],
         transformResponse: (res: Envelope<TestDetails>) => res.result!,
      }),
      createTest: builder.mutation<CreateTestResponse, CreateTestRequest>({
         query: body => ({
            url: 'Tests',
            method: 'POST',
            body,
         }),
         invalidatesTags: (_result, _error, { lessonId }) => [
            { type: 'Tests', id: 'LIST' },
            { type: 'LessonDetails', id: lessonId },
            { type: 'LessonDetails', id: 'LIST' },
         ],
         transformResponse: (res: Envelope<CreateTestResponse>) => res.result!,
      }),
      submitTestAnswers: builder.mutation<void, SubmitTestAnswersRequest>({
         query: body => ({
            url: 'Tests',
            method: 'PUT',
            body,
         }),
         invalidatesTags: (_result, _error, { testId }) => [
            { type: 'Tests', id: testId },
            { type: 'Tests', id: 'LIST' },
         ],
      }),
   }),
})
