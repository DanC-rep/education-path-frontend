import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { roadmapsSelectors, roadmapsActions } from '../../modules/roadmaps/roadmapSlice'
import { getLessonByIdThunk } from '../../modules/roadmaps/roadmapsThunk'
import { marked } from 'marked'
import { CircularProgress, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export function LessonDetailsPage() {
   const { lessonId } = useParams()
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const lesson = useAppSelector(roadmapsSelectors.selectCurrentLesson)
   const fetchStatus = useAppSelector(roadmapsSelectors.selectCurrentLessonStatus)
   const error = useAppSelector(roadmapsSelectors.selectCurrentLessonError)

   useEffect(() => {
      if (lessonId) {
         dispatch(getLessonByIdThunk(lessonId))
      }
      return () => {
         dispatch(roadmapsActions.clearCurrentLesson())
      }
   }, [dispatch, lessonId])

   const htmlContent = useMemo(() => {
      if (!lesson?.content) return ''
      return marked(lesson.content)
   }, [lesson?.content])

   const handleCompleteLesson = () => {
      // TODO: Implement lesson completion API call
      navigate(-1)
   }

   if (fetchStatus === 'loading') {
      return (
         <div className="flex items-center justify-center p-6">
            <CircularProgress />
         </div>
      )
   }

   if (fetchStatus === 'failed') {
      return <div className="p-6 text-rose-300">{error ?? 'Не удалось загрузить урок.'}</div>
   }

   if (fetchStatus === 'succeeded' && !lesson) {
      return <div className="p-6 text-slate-300">Урок не найден.</div>
   }

   return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
         {/* Header */}
         <div className="border-b border-slate-800/70 bg-slate-900/50 px-6 py-6">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                     <h1 className="text-3xl font-bold">{lesson?.title}</h1>
                     <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                           lesson?.type === 'Required'
                              ? 'bg-rose-500/15 text-rose-200 border border-rose-400/40'
                              : lesson?.type === 'Optional'
                                ? 'bg-slate-500/10 text-slate-200 border border-slate-400/30'
                                : 'bg-amber-500/15 text-amber-200 border border-amber-400/40'
                        }`}>
                        {lesson?.type}
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                     {lesson?.isCompleted ? (
                        <>
                           <CheckCircleIcon className="text-emerald-300" fontSize="small" />
                           <span className="text-emerald-200">Выполнен</span>
                        </>
                     ) : (
                        <>
                           <CheckCircleOutlineIcon className="text-slate-500" fontSize="small" />
                           <span className="text-slate-300">Не выполнен</span>
                        </>
                     )}
                  </div>
               </div>
               <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon />}
                  sx={{ textTransform: 'none' }}>
                  Назад
               </Button>
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Lesson Content */}
            <div className="prose prose-invert max-w-none rounded-2xl border border-slate-800/70 bg-slate-900/40 p-8 mb-8">
               <div
                  className="prose-p:text-slate-200 prose-h1:text-slate-100 prose-h2:text-slate-100 prose-h3:text-slate-100 prose-a:text-blue-400 prose-a:underline prose-code:text-amber-200 prose-code:bg-slate-950/50 prose-code:px-2 prose-code:py-1 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
               />
            </div>

            {/* External Links */}
            {lesson?.links && lesson.links.length > 0 && (
               <div className="mb-8 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
                  <h2 className="text-lg font-semibold mb-4">Полезные ссылки</h2>
                  <ul className="space-y-2">
                     {lesson.links.map((link, idx) => (
                        <li key={idx}>
                           <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline break-all">
                              {link}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {/* Navigation and Action Buttons */}
            <div className="flex flex-col gap-4">
               {/* Previous Lessons */}
               {lesson?.previousLessons && lesson.previousLessons.length > 0 && (
                  <div>
                     <h3 className="text-lg font-semibold mb-3 text-slate-100 flex items-center gap-2">
                        <ArrowBackIcon fontSize="small" className="text-slate-400" />
                        Предыдущие уроки
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lesson.previousLessons.map(prevLesson => (
                           <div
                              key={prevLesson.id}
                              className="rounded-lg border border-slate-800/70 bg-slate-900/40 p-4 cursor-pointer hover:bg-slate-900/60 transition"
                              onClick={() => navigate(`/lessons/${prevLesson.id}`)}>
                              <div className="text-slate-100 font-medium">{prevLesson.title}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Next Lessons */}
               {lesson?.nextLessons && lesson.nextLessons.length > 0 && (
                  <div>
                     <h3 className="text-lg font-semibold mb-3 text-slate-100 flex items-center gap-2">
                        Следующие уроки
                        <ArrowForwardIcon fontSize="small" className="text-slate-400" />
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lesson.nextLessons.map(nextLesson => (
                           <div
                              key={nextLesson.id}
                              className="rounded-lg border border-slate-800/70 bg-slate-900/40 p-4 cursor-pointer hover:bg-slate-900/60 transition"
                              onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
                              <div className="text-slate-100 font-medium">{nextLesson.title}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Complete Lesson Button */}
               {!lesson?.isCompleted && (
                  <Button
                     variant="contained"
                     color="success"
                     onClick={handleCompleteLesson}
                     className="w-full"
                     sx={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '12px',
                        backgroundColor: '#10b981',
                        '&:hover': {
                           backgroundColor: '#059669',
                        },
                     }}>
                     Завершить урок
                  </Button>
               )}
            </div>
         </div>
      </div>
   )
}
