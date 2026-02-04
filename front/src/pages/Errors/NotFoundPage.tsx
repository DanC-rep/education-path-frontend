import { Button } from '@mui/material'
import { Link } from 'react-router'

export function NotFoundPage() {
   return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
         <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h2 className="mt-2 text-2xl text-gray-600">Страница не найдена</h2>
            <p className="mt-4 text-gray-500">Извините, но запрашиваемая вами страница не существует.</p>
            <Link to="/">
               <div className="py-4">
                  <Button variant="contained" color="primary">
                     Вернуться на главную
                  </Button>
               </div>
            </Link>
         </div>
      </div>
   )
}