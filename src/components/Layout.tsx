import { Outlet } from 'react-router'
import Navigation from './Navigation'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
