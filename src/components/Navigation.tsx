import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, ShoppingCart, Globe, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { toggleCart, totalItems } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : lang === 'ar' ? 'fr' : 'en')

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.store'), path: '/store' },
    { label: t('nav.ranks'), path: '/#ranks' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.dealers'), path: '/dealers' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-xl border-b border-[#30363D]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] flex items-center justify-between">
          <Link to="/" className="text-[#01D7D5] font-semibold text-lg tracking-[0.05em]">
            E-RIDE
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors duration-300 ${
                  isActive(link.path) ? 'text-[#01D7D5]' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && !isDashboardPage && (
              <Link
                to="/dashboard"
                className={`text-sm transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'text-[#01D7D5]' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <LayoutDashboard size={14} />
                {t('nav.dashboard')}
              </Link>
            )}
            {isAdmin && !isDashboardPage && (
              <Link
                to="/admin"
                className={`text-sm transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-[#01D7D5]' : 'text-[#EF4444] hover:text-[#EF4444]/80'
                }`}
              >
                <Shield size={14} />
                {t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1.5 border border-[#30363D] rounded-lg px-3 py-1.5 text-[13px] text-[#8B949E] hover:border-[#01D7D5] hover:text-[#01D7D5] transition-colors duration-300"
            >
              <Globe size={14} />
              {lang === 'fr' ? 'FR' : lang === 'ar' ? 'AR' : 'EN'}
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 text-[#8B949E] hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#01D7D5] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthenticated && (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#161B22] border border-[#30363D] rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#30363D]">
                      <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-[#484F58] text-xs truncate">{user?.email || ''}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-[#8B949E] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                      <LayoutDashboard size={14} />
                      {t('nav.dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        <Shield size={14} />
                        {t('nav.admin')}
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#8B949E] hover:text-[#EF4444] hover:bg-[rgba(255,255,255,0.05)] transition-colors border-t border-[#30363D] mt-1"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#8B949E]">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-[70px]">
          <div className="flex flex-col items-center gap-6 pt-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`text-lg font-medium transition-colors ${isActive(link.path) ? 'text-[#01D7D5]' : 'text-[#8B949E]'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#8B949E] hover:text-[#01D7D5] flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  {t('nav.dashboard')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-[#EF4444] flex items-center gap-2">
                    <Shield size={18} />
                    {t('nav.admin')}
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-lg font-medium text-[#8B949E] hover:text-[#EF4444] mt-4">
                  {t('nav.logout')}
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
