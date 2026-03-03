import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../shared/components/RootLayout'
import { MainPage } from '../pages/MainPage/MainPage'
import { NotFoundPage } from '../pages/Errors/NotFoundPage.tsx'
import { LoginPage } from '../pages/Login/LoginPage.tsx'
import { RegisterPage } from '../pages/Register/RegisterPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { ProtectedRoute } from '../shared/components/ProtectedRoute.tsx'
import { RoadmapDetailsPage } from '../pages/RoadmapDetails/RoadmapDetailsPage'
import { LessonDetailsPage } from '../pages/LessonDetails/LessonDetailsPage'
import { CreateRoadmapPage } from '../pages/CreateRoadmap/CreateRoadmapPage'

export const router = createBrowserRouter([
   {
      path: '/',
      element: <RootLayout />,
      children: [
         {
            path: '',
            element: (
               <ProtectedRoute roles={['student']}>
                  <MainPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'login',
            element: <LoginPage />,
         },
         {
            path: 'register',
            element: <RegisterPage />,
         },
         {
            path: 'profile',
            element: (
               <ProtectedRoute roles={['student']}>
                  <ProfilePage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'roadmaps/create',
            element: (
               <ProtectedRoute roles={['student']}>
                  <CreateRoadmapPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'roadmaps/:id',
            element: (
               <ProtectedRoute roles={['student']}>
                  <RoadmapDetailsPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'lessons/:lessonId',
            element: (
               <ProtectedRoute roles={['student']}>
                  <LessonDetailsPage />
               </ProtectedRoute>
            ),
         },
      ],
      errorElement: <NotFoundPage />,
   },
])
