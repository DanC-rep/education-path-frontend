import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { NavBar } from './NavBar'

export function RootLayout() {
   return (
      <div className="flex flex-col h-screen">
         <Header />
         <NavBar />
         <main className="flex-1 overflow-auto">
            <Outlet />
         </main>
         <Footer />
      </div>
   )
}
