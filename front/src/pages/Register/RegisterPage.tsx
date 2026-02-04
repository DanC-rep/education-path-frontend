import { Alert, Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { authSelectors } from '../../modules/auth/authSlice'
import { registerThunk } from '../../modules/auth/register/registerThunk'

type RegisterFields = {
   email: string
   userName: string
   name: string
   surname: string
   patronymic: string
   password: string
}

export function RegisterPage() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<RegisterFields>()

   const dispatch = useAppDispatch()

   const fetchStatus = useAppSelector(authSelectors.selectAuthFetchStatus)
   const error = useAppSelector(authSelectors.selectRegistrationError)

   const onSubmit = async (data: RegisterFields) => {
      dispatch(
         registerThunk({
            email: data.email,
            userName: data.userName,
            fullName: { name: data.name, surname: data.surname, patronymic: data.patronymic },
            password: data.password,
         }),
      )
   }

   return (
      <div className="flex flex-col h-full w-full py-6 px-10 justify-center items-start gap-4">
         <div className="flex flex-col flex-1 min-w-80 mx-auto items-center">
            <p className="text-2xl font-bold text-center mb-6">Регистрация</p>
            <form className="flex flex-col w-full items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
               <TextField
                  {...register('email', { required: 'Это поле обязательно для заполнения' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                  size="medium"
                  label="Email"
                  className="mb-2"
                  fullWidth
               />

               <TextField
                  {...register('userName', { required: 'Это поле обязательно для заполнения' })}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  variant="outlined"
                  size="medium"
                  label="Имя пользователя"
                  className="mb-2"
                  fullWidth
               />

               <div className="flex gap-2 w-full">
                  <TextField
                     {...register('name', { required: 'Это поле обязательно для заполнения' })}
                     error={!!errors.name}
                     helperText={errors.name?.message}
                     variant="outlined"
                     size="medium"
                     label="Имя"
                     fullWidth
                  />

                  <TextField
                     {...register('surname', { required: 'Это поле обязательно для заполнения' })}
                     error={!!errors.surname}
                     helperText={errors.surname?.message}
                     variant="outlined"
                     size="medium"
                     label="Фамилия"
                     fullWidth
                  />

                  <TextField
                     {...register('patronymic')}
                     error={!!errors.patronymic}
                     helperText={errors.patronymic?.message}
                     variant="outlined"
                     size="medium"
                     label="Отчество"
                     fullWidth
                  />
               </div>

               <TextField
                  {...register('password', { required: 'Это поле обязательно для заполнения' })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                  size="medium"
                  label="Пароль"
                  className="mb-6 flex-1"
                  type="password"
                  fullWidth
               />

               <Button type="submit" disabled={fetchStatus === 'loading'} variant="contained">
                  Зарегистрироваться
               </Button>

               {error && (
                  <Alert
                     sx={{
                        width: '100%',
                        maxWidth: '400px',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-line',
                        alignSelf: 'center',
                     }}
                     variant="outlined"
                     severity="error">
                     {error}
                  </Alert>
               )}
            </form>

            <p className="pt-4">Уже зарегистрированы?</p>
            <NavLink to={'/login'} className="text-blue-600 underline">
               Войти
            </NavLink>
         </div>
      </div>
   )
}
