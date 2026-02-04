import { Tab, Tabs } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import HomeIcon from '@mui/icons-material/Home'
import { useAppSelector } from '../redux'
import { authSelectors } from '../../modules/auth/authSlice'

export function NavBar() {
   const [value, setValue] = React.useState('home')
   const navigate = useNavigate()

   const isAuthenticated = useAppSelector(authSelectors.selectIsAuthenticated)

   type TabValue = 'home'

   const handleChange = (_: React.SyntheticEvent, newValue: TabValue) => {
      setValue(newValue)

      switch (newValue) {
         case 'home':
            navigate('')
            break
      }
   }

   return (
      isAuthenticated && (
         <div>
            <Tabs onChange={handleChange} value={value}>
               <Tab label="Главная" icon={<HomeIcon fontSize="medium" />} iconPosition="start" value="home" />
            </Tabs>
         </div>
      )
   )
}
