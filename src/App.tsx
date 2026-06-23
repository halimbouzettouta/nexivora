import { Routes, Route } from 'react-router'
import { useEffect } from 'react'
import Layout from './components/Layout'
import AdminGuard from './components/AdminGuard'
import MarketerGuard from './components/MarketerGuard'
import Home from './pages/Home'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import About from './pages/About'
import Blog from './pages/Blog'
import ArticleDetail from './pages/ArticleDetail'
import Dealers from './pages/Dealers'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminSetup from './pages/AdminSetup'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import AdminLogin from './pages/AdminLogin'
import NotFound from './pages/NotFound'

export default function App() {
  // Capture referral code from URL and persist in sessionStorage
  useEffect(() => {
    const checkRef = () => {
      const hash = window.location.hash
      const refMatch = hash.match(/[?&]ref=([^&]+)/)
      if (refMatch) {
        sessionStorage.setItem('nxv_order_ref', refMatch[1])
      }
    }
    checkRef()
    window.addEventListener('hashchange', checkRef)
    return () => window.removeEventListener('hashchange', checkRef)
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<ArticleDetail />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<MarketerGuard><Dashboard /></MarketerGuard>} />
        <Route path="/dashboard/:tab" element={<MarketerGuard><Dashboard /></MarketerGuard>} />
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/:tab" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/setup" element={<AdminSetup />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
