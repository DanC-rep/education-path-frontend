import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../theme'
import { RouterProvider } from 'react-router'
import { router } from '../app/Router'
import { Provider } from 'react-redux'
import { store } from '../app/store'

createRoot(document.getElementById('root')!).render(
   <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   </ThemeProvider>,
)