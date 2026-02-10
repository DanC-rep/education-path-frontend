import { CircularProgress } from '@mui/material'
import { Link } from 'react-router'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { authSelectors } from '../../modules/auth/authSlice'
import { RoadmapLevel } from '../../modules/roadmaps/roadmapApi'
import { getUserRoadmapsThunk } from '../../modules/roadmaps/roadmapsThunk'
import { roadmapsActions, roadmapsSelectors } from '../../modules/roadmaps/roadmapSlice'

const levelStyles: Record<RoadmapLevel, { badge: string; card: string }> = {
   Beginning: {
      badge: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30',
      card: 'border-emerald-400/30 ring-1 ring-emerald-400/10',
   },
   Basic: {
      badge: 'bg-sky-500/15 text-sky-200 border border-sky-400/30',
      card: 'border-sky-400/30 ring-1 ring-sky-400/10',
   },
   Advanced: {
      badge: 'bg-amber-500/15 text-amber-200 border border-amber-400/30',
      card: 'border-amber-400/30 ring-1 ring-amber-400/10',
   },
}

export function MainPage() {
   const dispatch = useAppDispatch()
   const userId = useAppSelector(authSelectors.selectCurrentUserId)
   const roadmaps = useAppSelector(roadmapsSelectors.selectRoadmaps)
   const fetchStatus = useAppSelector(roadmapsSelectors.selectRoadmapsStatus)
   const error = useAppSelector(roadmapsSelectors.selectRoadmapsError)

   useEffect(() => {
      if (userId) {
         dispatch(getUserRoadmapsThunk(userId))
      }

      return () => {
         dispatch(roadmapsActions.clearRoadmaps())
      }
   }, [dispatch, userId])

   if (!userId) return <div className="p-6">Пользователь не найден</div>

   return (
      <div className="p-6 text-slate-100">
         <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
               <h1 className="text-2xl font-semibold">Мои роадмапы</h1>
               <p className="text-sm text-slate-400">Выберите путь, чтобы посмотреть подробности.</p>
            </div>
            <Link
               to="/roadmaps/create"
               className="inline-flex items-center rounded-md border border-slate-600/60 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800">
               Создать роадмап
            </Link>
         </div>

         {fetchStatus === 'loading' && (
            <div className="flex items-center gap-2 mt-6 text-slate-300">
               <CircularProgress size={20} />
               <span>Загрузка роадмапов...</span>
            </div>
         )}

         {fetchStatus === 'failed' && (
            <div className="mt-6 text-rose-300">{error ?? 'Не удалось загрузить роадмапы.'}</div>
         )}

         {fetchStatus !== 'loading' && fetchStatus !== 'failed' && roadmaps.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-slate-600/60 bg-slate-900/30 p-6 text-center">
               <p className="text-slate-300">У вас пока нет роадмапов.</p>
               <Link to="/roadmaps/create" className="mt-3 inline-flex text-sm font-semibold text-sky-300">
                  Перейти к созданию
               </Link>
            </div>
         )}

         {roadmaps.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
               {roadmaps.map(roadmap => {
                  const style = levelStyles[roadmap.level]

                  return (
                     <Link key={roadmap.id} to={`/roadmaps/${roadmap.id}`} className="block">
                        <div
                           className={`h-full rounded-xl border bg-slate-900/40 p-5 shadow-sm transition hover:shadow-md hover:bg-slate-900/60 ${style.card}`}>
                           <div className="flex items-center justify-between gap-3">
                              <h2 className="text-lg font-semibold text-slate-100">{roadmap.title}</h2>
                              <span
                                 className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                                 {roadmap.level}
                              </span>
                           </div>
                           <p className="mt-3 text-sm text-slate-300">{roadmap.descriptions}</p>
                           <div className="mt-4 text-sm font-medium text-sky-300">Подробнее →</div>
                        </div>
                     </Link>
                  )
               })}
            </div>
         )}
      </div>
   )
}
