import { AppBar, IconButton, Tooltip } from '@mui/material'
import BookIcon from '@mui/icons-material/Book'
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'
import { NavLink } from 'react-router'
import { useAppDispatch, useAppSelector } from '../redux'
import { authSelectors } from '../../modules/auth/authSlice'
import { logoutThunk } from '../../modules/auth/logout/logoutThunk'

export function Header() {
   const dispatch = useAppDispatch()
   const isAuthenticated = useAppSelector(authSelectors.selectIsAuthenticated)

   const handleLogout = () => {
      dispatch(logoutThunk())
   }

   return (
      <AppBar position="static" color="primary" elevation={1}>
         <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
               <NavLink to="/">
                  <IconButton edge="start" color="inherit">
                     <BookIcon fontSize="large" />
                  </IconButton>
               </NavLink>
               <div className="flex flex-col leading-tight">
                  <span className="text-lg font-semibold">Education Path</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               {isAuthenticated && (
                  <div>
                     <Tooltip title="профиль">
                        <NavLink to="/profile">
                           <IconButton color="inherit">
                              <PersonIcon />
                           </IconButton>
                        </NavLink>
                     </Tooltip>
                     <Tooltip title="выйти">
                        <IconButton color="inherit" onClick={handleLogout}>
                           <LoginIcon />
                        </IconButton>
                     </Tooltip>
                  </div>
               )}
            </div>
         </div>
      </AppBar>
   )
}
