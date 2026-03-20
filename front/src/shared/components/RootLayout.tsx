import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'

export function RootLayout() {
   return (
      <div className="flex flex-col h-screen">
         <Header />
         <main className="flex-1 overflow-auto">
            <Outlet />
         </main>
         <Footer />
      </div>
   )
}
