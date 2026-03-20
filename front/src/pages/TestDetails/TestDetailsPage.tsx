import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { testsActions, testsSelectors } from '../../modules/tests/testSlice'
import { getTestByIdThunk } from '../../modules/tests/testThunk'
import { submitTestAnswersThunk } from '../../modules/tests/testThunk'

type SelectedAnswers = Record<string, string>

export function TestDetailsPage() {
   const { testId } = useParams()
   const navigate = useNavigate()
   const dispatch = useAppDispatch()
   const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})

   const test = useAppSelector(testsSelectors.selectCurrentTest)
   const testStatus = useAppSelector(testsSelectors.selectCurrentTestStatus)
   const testError = useAppSelector(testsSelectors.selectCurrentTestError)
   const submitTestStatus = useAppSelector(testsSelectors.selectSubmitTestStatus)
   const submitTestError = useAppSelector(testsSelectors.selectSubmitTestError)

   useEffect(() => {
      if (testId) {
         dispatch(getTestByIdThunk(testId))
      }

      return () => {
         dispatch(testsActions.clearCurrentTest())
         dispatch(testsActions.clearSubmitTestStatus())
      }
   }, [dispatch, testId])

   const totalQuestions = test?.questions.length ?? 0
   const answeredCount = useMemo(() => Object.keys(selectedAnswers).length, [selectedAnswers])
   const correctAnswersCount = useMemo(
      () => test?.questions.filter(question => question.isCorrectAnswer === true).length ?? 0,
      [test?.questions],
   )

   const handleSelectAnswer = (questionId: string, answerId: string) => {
      if (test?.isCompleted) {
         return
      }

      setSelectedAnswers(prev => ({
         ...prev,
         [questionId]: answerId,
      }))
   }

   const handleSubmitAnswers = async () => {
      if (!testId || !test || submitTestStatus === 'loading') {
         return
      }

      const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
         questionId,
         answerId,
      }))

      const resultAction = await dispatch(
         submitTestAnswersThunk({
            testId,
            answers,
         }),
      )

      if (submitTestAnswersThunk.fulfilled.match(resultAction)) {
         // Перезагружаем тест для получения результатов
         await dispatch(getTestByIdThunk(testId))
         dispatch(testsActions.clearSubmitTestStatus())
      }
   }

   if (testStatus === 'loading') {
      return (
         <div className="flex items-center justify-center p-6">
            <CircularProgress />
         </div>
      )
   }

   if (testStatus === 'failed') {
      return <div className="p-6 text-rose-300">{testError ?? 'Не удалось загрузить тест.'}</div>
   }

   if (testStatus === 'succeeded' && !test) {
      return <div className="p-6 text-slate-300">Тест не найден.</div>
   }

   return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
         <div className="border-b border-slate-800/70 bg-slate-900/50 px-6 py-6">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                  <h1 className="text-3xl font-bold">{test?.title}</h1>
                  <p className="mt-2 text-slate-300">{test?.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                     <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200">
                        Вопросов: {totalQuestions}
                     </span>
                     {test?.isCompleted ? (
                        <span className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-emerald-200">
                           Завершен: {correctAnswersCount} / {totalQuestions}
                        </span>
                     ) : (
                        <span className="rounded-full border border-blue-400/50 bg-blue-500/15 px-3 py-1 text-blue-200">
                           Отвечено: {answeredCount} / {totalQuestions}
                        </span>
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

         <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
            {test?.isCompleted && (
               <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-100">
                  Тест уже пройден. Доступен только просмотр результатов.
               </div>
            )}

            {test?.questions.map((question, questionIndex) => (
               <section
                  key={question.id}
                  className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 shadow-sm">
                  <div className="mb-5 flex items-start justify-between gap-3">
                     <h2 className="text-lg font-semibold text-slate-100">
                        {questionIndex + 1}. {question.title}
                     </h2>

                     {test.isCompleted && (
                        <span
                           className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              question.isCorrectAnswer
                                 ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
                                 : 'border-rose-400/50 bg-rose-500/15 text-rose-200'
                           }`}>
                           {question.isCorrectAnswer ? (
                              <TaskAltIcon fontSize="inherit" />
                           ) : (
                              <CancelIcon fontSize="inherit" />
                           )}
                           {question.isCorrectAnswer ? 'Верно' : 'Неверно'}
                        </span>
                     )}
                  </div>

                  <div className="space-y-3">
                     {question.answers.map(answer => {
                        const isSelected = selectedAnswers[question.id] === answer.id
                        const showCorrect = test.isCompleted && answer.isCorrect

                        return (
                           <button
                              key={answer.id}
                              type="button"
                              onClick={() => handleSelectAnswer(question.id, answer.id)}
                              disabled={test.isCompleted}
                              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                                 showCorrect
                                    ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
                                    : isSelected
                                      ? 'border-blue-400/70 bg-blue-500/10 text-blue-100'
                                      : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
                              } ${test.isCompleted ? 'cursor-default' : 'cursor-pointer'}`}>
                              <span className="mt-0.5 text-slate-300">
                                 {isSelected ? (
                                    <CheckCircleIcon fontSize="small" className="text-blue-300" />
                                 ) : (
                                    <RadioButtonUncheckedIcon fontSize="small" />
                                 )}
                              </span>
                              <span className="flex-1">{answer.title}</span>
                              {showCorrect && <TaskAltIcon fontSize="small" className="text-emerald-300" />}
                           </button>
                        )
                     })}
                  </div>
               </section>
            ))}

            {!test?.isCompleted && (
               <div className="sticky bottom-4 z-10 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 backdrop-blur">
                  <div className="mb-3 text-sm text-slate-300">
                     Вы ответили на {answeredCount} из {totalQuestions} вопросов.
                  </div>
                  <Button
                     fullWidth
                     variant="contained"
                     onClick={handleSubmitAnswers}
                     disabled={submitTestStatus === 'loading'}
                     sx={{ textTransform: 'none', py: 1.2 }}>
                     {submitTestStatus === 'loading' ? 'Отправляем ответы...' : 'Отправить ответы'}
                  </Button>
                  {submitTestStatus === 'failed' && (
                     <div className="mt-3 text-sm text-rose-300">
                        {submitTestError ?? 'Не удалось отправить ответы.'}
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}
