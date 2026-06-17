import { Outlet } from 'react-router'
import Navigation from './Navigation'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import ToastContainer from './ToastContainer'
import ChatBot from './ChatBot'

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <ChatBot />
    </div>
  )
}
