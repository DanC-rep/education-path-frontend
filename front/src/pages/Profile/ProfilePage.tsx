import { Button, CircularProgress, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { authSelectors } from '../../modules/auth/authSlice'
import { usersActions } from '../../modules/users/userSlice'
import { getUserThunk } from '../../modules/users/getUserThunk'

export function ProfilePage() {
   const dispatch = useAppDispatch()
   const userId = useAppSelector(authSelectors.selectCurrentUserId)
   const currentUser = useAppSelector(state => state.users.currentUser)
   const fetchStatus = useAppSelector(state => state.users.fetchStatus)
   const error = useAppSelector(state => state.users.error)

   const [editing, setEditing] = useState(false)
   const [name, setName] = useState('')
   const [surname, setSurname] = useState('')
   const [patronymic, setPatronymic] = useState('')

   useEffect(() => {
      if (userId) dispatch(getUserThunk(userId))

      return () => {
         dispatch(usersActions.clearUser())
      }
   }, [dispatch, userId])

   // set fields when entering edit mode to avoid sync setState in effect
   const onEdit = () => {
      if (currentUser) {
         setName(currentUser.name)
         setSurname(currentUser.surname)
         setPatronymic(currentUser.patronymic || '')
      }
      setEditing(true)
   }

   if (!userId) return <div className="p-6">Не авторизован</div>

   return (
      <div className="p-6">
         <h2 className="text-2xl mb-4">Профиль</h2>

         {fetchStatus === 'loading' && <CircularProgress />}

         {error && <div className="text-red-600">{error}</div>}

         {currentUser && (
            <div className="flex flex-col gap-4 max-w-2xl">
               <div className="flex gap-4 items-center">
                  <div className="w-40">Имя:</div>
                  {editing ? (
                     <TextField value={name} onChange={e => setName(e.target.value)} size="small" />
                  ) : (
                     <div>{currentUser.name}</div>
                  )}
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-40">Фамилия:</div>
                  {editing ? (
                     <TextField value={surname} onChange={e => setSurname(e.target.value)} size="small" />
                  ) : (
                     <div>{currentUser.surname}</div>
                  )}
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-40">Отчество:</div>
                  {editing ? (
                     <TextField value={patronymic} onChange={e => setPatronymic(e.target.value)} size="small" />
                  ) : (
                     <div>{currentUser.patronymic}</div>
                  )}
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-40">Имя пользователя:</div>
                  <div>{currentUser.userName}</div>
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-40">Роли:</div>
                  <div>{currentUser.roles.map((r: { name: string }) => r.name).join(', ')}</div>
               </div>

               <div className="flex gap-2 pt-4">
                  {editing ? (
                     <>
                        <Button variant="contained" color="primary" onClick={() => setEditing(false)}>
                           Сохранить (пока визуально)
                        </Button>
                        <Button variant="outlined" onClick={() => setEditing(false)}>
                           Отмена
                        </Button>
                     </>
                  ) : (
                     <Button variant="contained" onClick={onEdit}>
                        Редактировать
                     </Button>
                  )}
               </div>
            </div>
         )}
      </div>
   )
}
