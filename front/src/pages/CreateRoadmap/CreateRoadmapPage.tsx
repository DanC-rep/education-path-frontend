import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { authSelectors } from '../../modules/auth/authSlice'
import { getSkillsThunk, createRoadmapThunk } from '../../modules/roadmaps/roadmapsThunk'
import { roadmapsSelectors, roadmapsActions } from '../../modules/roadmaps/roadmapSlice'
import { Skill } from '../../modules/roadmaps/roadmapApi'

export function CreateRoadmapPage() {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()
   const userId = useAppSelector(authSelectors.selectCurrentUserId)
   const skills = useAppSelector(roadmapsSelectors.selectSkills)
   const skillsFetchStatus = useAppSelector(roadmapsSelectors.selectSkillsFetchStatus)
   const skillsError = useAppSelector(roadmapsSelectors.selectSkillsError)
   const createStatus = useAppSelector(roadmapsSelectors.selectCreateRoadmapStatus)
   const createError = useAppSelector(roadmapsSelectors.selectCreateRoadmapError)

   const [selectedSkills, setSelectedSkills] = useState<string[]>([])
   const [level, setLevel] = useState<number>(0)
   const [additionalData, setAdditionalData] = useState<string>('')
   const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
   const [selectedRootSkillId, setSelectedRootSkillId] = useState<string | null>(null)

   useEffect(() => {
      dispatch(getSkillsThunk())
   }, [dispatch])

   useEffect(() => {
      return () => {
         dispatch(roadmapsActions.clearCreateRoadmapStatus())
      }
   }, [dispatch])

   const findRootSkillId = (skillId: string): string | null => {
      const findInTree = (skill: Skill): string | null => {
         if (skill.id === skillId) {
            return skill.parentId ? findRootSkillId(skill.parentId) : skill.id
         }
         if (skill.children) {
            for (const child of skill.children) {
               const result = findInTree(child)
               if (result) return result
            }
         }
         return null
      }

      for (const skill of skills) {
         const result = findInTree(skill)
         if (result) return result
      }
      return null
   }

   const handleSkillToggle = (skillId: string) => {
      const isSelected = selectedSkills.includes(skillId)

      if (isSelected) {
         // Removing skill
         const newSkills = selectedSkills.filter(id => id !== skillId)
         setSelectedSkills(newSkills)

         // If no skills selected, reset root skill
         if (newSkills.length === 0) {
            setSelectedRootSkillId(null)
         }
      } else {
         // Adding skill
         const rootSkillId = findRootSkillId(skillId)

         if (!selectedRootSkillId) {
            // First selection
            setSelectedRootSkillId(rootSkillId)
            setSelectedSkills([...selectedSkills, skillId])
         } else if (selectedRootSkillId === rootSkillId) {
            // Same root, allow selection
            setSelectedSkills([...selectedSkills, skillId])
         } else {
            // Different root, show alert
            alert('Вы можете выбирать навыки только из одной ветки. Сначала очистите выборку текущей ветки.')
         }
      }
   }

   const handleGroupToggle = (skillId: string) => {
      setExpandedGroups(prev => {
         const newSet = new Set(prev)
         if (newSet.has(skillId)) {
            newSet.delete(skillId)
         } else {
            newSet.add(skillId)
         }
         return newSet
      })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (selectedSkills.length === 0) {
         alert('Пожалуйста, выберите хотя бы один навык')
         return
      }

      if (!userId) {
         alert('Пользователь не найден')
         return
      }

      const result = await dispatch(
         createRoadmapThunk({
            skillsIds: selectedSkills,
            userId,
            level,
            userAdditionalData: additionalData || undefined,
         }),
      )

      if (createRoadmapThunk.fulfilled.match(result)) {
         navigate('/')
      }
   }

   const renderSkillTree = (parentSkills: Skill[]) => {
      return parentSkills.map(skill => (
         <div key={skill.id} className="ml-4 mb-2">
            <div className="flex items-center gap-2">
               {skill.children && skill.children.length > 0 && (
                  <button
                     type="button"
                     onClick={() => handleGroupToggle(skill.id)}
                     className="text-slate-400 hover:text-slate-200 w-5">
                     {expandedGroups.has(skill.id) ? '▼' : '▶'}
                  </button>
               )}
               {(!skill.children || skill.children.length === 0) && <div className="w-5"></div>}
               <input
                  type="checkbox"
                  id={skill.id}
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                  className="w-4 h-4 rounded border-slate-600 text-sky-600 cursor-pointer"
               />
               <label htmlFor={skill.id} className="flex flex-col cursor-pointer flex-1">
                  <span className="text-sm font-medium text-slate-100">{skill.name}</span>
                  {skill.description && <span className="text-xs text-slate-400">{skill.description}</span>}
               </label>
            </div>
            {skill.children && skill.children.length > 0 && expandedGroups.has(skill.id) && (
               <div className="mt-2">{renderSkillTree(skill.children)}</div>
            )}
         </div>
      ))
   }

   if (!userId) {
      return <div className="p-6 text-slate-100">Пользователь не найден</div>
   }

   return (
      <div className="p-6 text-slate-100">
         <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2">Создать новый роадмап</h1>
            <p className="text-sm text-slate-400 mb-6">Выберите навыки, которые вы хотели бы изучить</p>

            {skillsError && (
               <div className="mb-6 p-4 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300">
                  {skillsError}
               </div>
            )}

            {createError && (
               <div className="mb-6 p-4 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300">
                  {createError}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Skills Selection */}
               <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
                  <label className="text-sm font-semibold text-slate-100 mb-4 block">Выберите навыки</label>

                  {skillsFetchStatus === 'loading' && (
                     <div className="flex items-center gap-2 text-slate-300">
                        <CircularProgress size={20} />
                        <span>Загрузка навыков...</span>
                     </div>
                  )}

                  {skillsFetchStatus !== 'loading' && skills.length > 0 && (
                     <div className="space-y-2">{renderSkillTree(skills)}</div>
                  )}

                  {skillsFetchStatus !== 'loading' && skills.length === 0 && !skillsError && (
                     <p className="text-slate-400">Навыки не найдены</p>
                  )}
               </div>

               {/* Level Selection */}
               <FormControl fullWidth margin="normal">
                  <InputLabel id="level-label" sx={{ color: '#cbd5e1' }}>
                     Уровень сложности
                  </InputLabel>
                  <Select
                     labelId="level-label"
                     id="level"
                     value={level}
                     label="Уровень сложности"
                     onChange={e => setLevel(e.target.value as number)}
                     sx={{
                        backgroundColor: '#1e293b',
                        color: '#e2e8f0',
                        '& .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#475569',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#64748b',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#38bdf8',
                        },
                        '& .MuiSvgIcon-root': {
                           color: '#cbd5e1',
                        },
                     }}>
                     <MenuItem value={0}>Начинающий</MenuItem>
                     <MenuItem value={1}>Стандартный</MenuItem>
                     <MenuItem value={2}>Продвинутый</MenuItem>
                  </Select>
               </FormControl>

               {/* Additional Data */}
               <TextField
                  fullWidth
                  margin="normal"
                  label="Дополнительная информация"
                  placeholder="Например, в какую тему вы хотели бы углубиться или у вас есть специфические требования?"
                  multiline
                  rows={4}
                  value={additionalData}
                  onChange={e => setAdditionalData(e.target.value)}
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        backgroundColor: '#1e293b',
                        color: '#e2e8f0',
                        '& fieldset': {
                           borderColor: '#475569',
                        },
                        '&:hover fieldset': {
                           borderColor: '#64748b',
                        },
                        '&.Mui-focused fieldset': {
                           borderColor: '#38bdf8',
                        },
                     },
                     '& .MuiOutlinedInput-input::placeholder': {
                        color: '#64748b',
                        opacity: 1,
                     },
                     '& .MuiInputBase-input': {
                        color: '#e2e8f0',
                     },
                     '& .MuiInputLabel-root': {
                        color: '#cbd5e1',
                     },
                  }}
               />

               {/* Action Buttons */}
               <div className="flex gap-3 pt-4">
                  <button
                     type="button"
                     onClick={() => navigate('/')}
                     className="flex-1 px-4 py-2 rounded-md border border-slate-600/60 bg-slate-800/60 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800 transition">
                     Отмена
                  </button>
                  <button
                     type="submit"
                     disabled={createStatus === 'loading' || skillsFetchStatus === 'loading'}
                     className="flex-1 px-4 py-2 rounded-md bg-sky-600 text-sm font-medium text-white hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                     {createStatus === 'loading' && <CircularProgress size={16} />}
                     {createStatus === 'loading' ? 'Создание...' : 'Создать роадмап'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}
