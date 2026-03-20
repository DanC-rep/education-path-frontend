import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { roadmapsSelectors, roadmapsActions } from '../../modules/roadmaps/roadmapSlice'
import { askLessonQuestionThunk, completeLessonThunk, getLessonByIdThunk } from '../../modules/roadmaps/roadmapsThunk'
import { testsActions, testsSelectors } from '../../modules/tests/testSlice'
import { createTestThunk } from '../../modules/tests/testThunk'
import { marked } from 'marked'
import { CircularProgress, Button, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SendIcon from '@mui/icons-material/Send'

type ChatMessage = {
   id: string
   role: 'user' | 'assistant'
   text: string
   isError?: boolean
}

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function LessonDetailsPage() {
   const { lessonId } = useParams()
   const navigate = useNavigate()
   const dispatch = useAppDispatch()
   const [isChatOpen, setIsChatOpen] = useState(false)
   const [chatQuestion, setChatQuestion] = useState('')
   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      {
         id: createMessageId(),
         role: 'assistant',
         text: 'Привет! Я помогу разобраться с этим уроком. Задайте вопрос по теме, примеру кода или следующему шагу.',
      },
   ])
   const chatBottomRef = useRef<HTMLDivElement | null>(null)

   const lesson = useAppSelector(roadmapsSelectors.selectCurrentLesson)
   const fetchStatus = useAppSelector(roadmapsSelectors.selectCurrentLessonStatus)
   const error = useAppSelector(roadmapsSelectors.selectCurrentLessonError)
   const completeLessonStatus = useAppSelector(roadmapsSelectors.selectCompleteLessonStatus)
   const completeLessonError = useAppSelector(roadmapsSelectors.selectCompleteLessonError)
   const askLessonQuestionStatus = useAppSelector(roadmapsSelectors.selectAskLessonQuestionStatus)
   const createTestStatus = useAppSelector(testsSelectors.selectCreateTestStatus)
   const createTestError = useAppSelector(testsSelectors.selectCreateTestError)

   useEffect(() => {
      if (lessonId) {
         dispatch(getLessonByIdThunk(lessonId))
      }

      return () => {
         dispatch(roadmapsActions.clearCurrentLesson())
         dispatch(roadmapsActions.clearCompleteLessonStatus())
         dispatch(roadmapsActions.clearAskLessonQuestionStatus())
         dispatch(testsActions.clearCreateTestStatus())
      }
   }, [dispatch, lessonId])

   useEffect(() => {
      setChatMessages([
         {
            id: createMessageId(),
            role: 'assistant',
            text: 'Привет! Я помогу разобраться с этим уроком. Задайте вопрос по теме, примеру кода или следующему шагу.',
         },
      ])
      setChatQuestion('')
      setIsChatOpen(false)
      dispatch(roadmapsActions.clearAskLessonQuestionStatus())
      dispatch(testsActions.clearCreateTestStatus())
   }, [dispatch, lessonId])

   useEffect(() => {
      if (isChatOpen) {
         chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
   }, [chatMessages, isChatOpen])

   const htmlContent = useMemo(() => {
      if (!lesson?.content) return ''
      return marked(lesson.content)
   }, [lesson?.content])

   const handleCompleteLesson = async () => {
      if (!lessonId || completeLessonStatus === 'loading') {
         return
      }

      const resultAction = await dispatch(completeLessonThunk(lessonId))

      if (completeLessonThunk.fulfilled.match(resultAction)) {
         navigate(-1)
      }
   }

   const handleSendQuestion = async () => {
      const trimmedQuestion = chatQuestion.trim()

      if (!lessonId || !trimmedQuestion || askLessonQuestionStatus === 'loading') {
         return
      }

      setChatMessages(prev => [
         ...prev,
         {
            id: createMessageId(),
            role: 'user',
            text: trimmedQuestion,
         },
      ])
      setChatQuestion('')

      const resultAction = await dispatch(
         askLessonQuestionThunk({
            lessonId,
            question: trimmedQuestion,
         }),
      )

      if (askLessonQuestionThunk.fulfilled.match(resultAction)) {
         setChatMessages(prev => [
            ...prev,
            {
               id: createMessageId(),
               role: 'assistant',
               text:
                  resultAction.payload.answer?.trim() ||
                  'Ответ получен, но оказался пустым. Попробуйте уточнить вопрос.',
            },
         ])
         return
      }

      setChatMessages(prev => [
         ...prev,
         {
            id: createMessageId(),
            role: 'assistant',
            text: resultAction.payload ?? 'Не удалось получить ответ от нейросети. Попробуйте снова.',
            isError: true,
         },
      ])
   }

   const handleCreateTest = async () => {
      if (!lessonId || createTestStatus === 'loading') {
         return
      }

      const resultAction = await dispatch(
         createTestThunk({
            lessonId,
         }),
      )

      if (createTestThunk.fulfilled.match(resultAction)) {
         navigate(`/tests/${resultAction.payload}`)
      }
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
                  <div className="space-y-2">
                     <Button
                        variant="contained"
                        color="success"
                        onClick={handleCompleteLesson}
                        disabled={completeLessonStatus === 'loading'}
                        className="w-full"
                        sx={{
                           textTransform: 'none',
                           fontSize: '1rem',
                           padding: '12px',
                        }}>
                        {completeLessonStatus === 'loading' ? 'Завершаем...' : 'Завершить урок'}
                     </Button>
                     {completeLessonStatus === 'failed' && (
                        <div className="text-sm text-rose-300">
                           {completeLessonError ?? 'Не удалось завершить урок.'}
                        </div>
                     )}
                  </div>
               )}

               <div className="space-y-2">
                  {lesson?.testId ? (
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/tests/${lesson.testId}`)}
                        className="w-full"
                        sx={{
                           textTransform: 'none',
                           fontSize: '1rem',
                           padding: '12px',
                        }}>
                        Открыть тест
                     </Button>
                  ) : (
                     <Button
                        variant="contained"
                        color="warning"
                        onClick={handleCreateTest}
                        disabled={createTestStatus === 'loading' || !lessonId}
                        className="w-full"
                        sx={{
                           textTransform: 'none',
                           fontSize: '1rem',
                           padding: '12px',
                        }}>
                        {createTestStatus === 'loading' ? 'Создаем тест...' : 'Создать тест'}
                     </Button>
                  )}

                  {createTestStatus === 'failed' && (
                     <div className="text-sm text-rose-300">{createTestError ?? 'Не удалось создать тест.'}</div>
                  )}
               </div>
            </div>
         </div>

         <div className="fixed bottom-20 right-6 z-30 w-[min(420px,calc(100vw-2rem))]">
            {!isChatOpen ? (
               <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsChatOpen(true)}
                  startIcon={<SmartToyIcon />}
                  sx={{
                     textTransform: 'none',
                     borderRadius: '999px',
                     px: 2.5,
                     py: 1.2,
                  }}>
                  Чат с нейросетью
               </Button>
            ) : (
               <div className="rounded-2xl border border-slate-800/70 bg-slate-900/95 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between border-b border-slate-800/70 px-4 py-3">
                     <div className="flex items-center gap-2 text-slate-100 font-semibold">
                        <SmartToyIcon fontSize="small" className="text-blue-300" />
                        Чат по уроку
                     </div>
                     <Button
                        size="small"
                        onClick={() => setIsChatOpen(false)}
                        sx={{ textTransform: 'none', minWidth: 0, px: 1.2 }}>
                        Свернуть
                     </Button>
                  </div>

                  <div className="max-h-90 overflow-y-auto px-4 py-4 space-y-3">
                     {chatMessages.map(message => (
                        <div
                           key={message.id}
                           className={`max-w-[90%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                              message.role === 'user'
                                 ? 'ml-auto bg-blue-500/20 border border-blue-400/40 text-blue-100'
                                 : message.isError
                                   ? 'bg-rose-500/15 border border-rose-400/40 text-rose-200'
                                   : 'bg-slate-800/90 border border-slate-700 text-slate-100'
                           }`}>
                           {message.text}
                        </div>
                     ))}

                     {askLessonQuestionStatus === 'loading' && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-sm text-slate-200">
                           <CircularProgress size={16} />
                           Нейросеть формирует ответ...
                        </div>
                     )}

                     <div ref={chatBottomRef} />
                  </div>

                  <div className="border-t border-slate-800/70 px-4 py-3 flex flex-col gap-3">
                     <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={5}
                        size="small"
                        placeholder="Напишите вопрос по текущему уроку"
                        value={chatQuestion}
                        onChange={event => setChatQuestion(event.target.value)}
                        onKeyDown={event => {
                           if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              void handleSendQuestion()
                           }
                        }}
                        sx={{
                           '& .MuiOutlinedInput-root': {
                              color: '#e2e8f0',
                              backgroundColor: 'rgba(15, 23, 42, 0.5)',
                              '& fieldset': {
                                 borderColor: 'rgba(71, 85, 105, 0.55)',
                              },
                              '&:hover fieldset': {
                                 borderColor: 'rgba(96, 165, 250, 0.8)',
                              },
                              '&.Mui-focused fieldset': {
                                 borderColor: 'rgba(96, 165, 250, 1)',
                              },
                           },
                           '& .MuiInputBase-input::placeholder': {
                              color: '#94a3b8',
                              opacity: 1,
                           },
                        }}
                     />

                     <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSendQuestion}
                        disabled={!chatQuestion.trim() || askLessonQuestionStatus === 'loading' || !lessonId}
                        endIcon={<SendIcon />}
                        sx={{ textTransform: 'none' }}>
                        {askLessonQuestionStatus === 'loading' ? 'Отправляем...' : 'Отправить вопрос'}
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}
