import { AppBar, IconButton, Tooltip } from '@mui/material'
import BookIcon from '@mui/icons-material/Book';
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'
import { NavLink } from 'react-router'
import { useAppSelector } from '../redux'
import { authSelectors } from '../../modules/auth/authSlice'

export function Header() {
   const isAuthenticated = useAppSelector(authSelectors.selectIsAuthenticated)

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
                        <NavLink to="/logout">
                           <IconButton color="inherit">
                              <LoginIcon />
                           </IconButton>
                        </NavLink>
                     </Tooltip>
                  </div>
               )}
            </div>
         </div>
      </AppBar>
   )
}
