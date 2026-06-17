import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, ShoppingCart, Globe, LogIn, LogOut } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { isMarketerLoggedIn, getMarketerSession, clearMarketerSession } from '@/hooks/marketerAuth'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { toggleCart, totalItems } = useCart()
  const { lang, setLang, t } = useLanguage()

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : lang === 'ar' ? 'fr' : 'en')

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.store'), path: '/store' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.dealers'), path: '/dealers' },
    { label: t('nav.contact'), path: '/contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[90px] flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-xl border-b border-[#30363D]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/nexivora-logo.png" alt="NEXIVORA" className="h-20 w-auto" />
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

            {isMarketerLoggedIn() ? (
              <Link to="/dashboard" className="hidden sm:flex items-center gap-1.5 text-[#8B949E] hover:text-[#01D7D5] text-sm transition-colors">
                <span className="w-7 h-7 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center text-[#01D7D5] text-xs font-bold">
                  {getMarketerSession()?.name?.charAt(0) || 'U'}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-[#30363D] text-[#8B949E] rounded-lg hover:border-[#01D7D5] hover:text-[#01D7D5] transition-colors">
                <LogIn size={16} /> Member Login
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#8B949E]">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-[90px]">
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

            {/* Mobile Cart */}
            <button
              onClick={() => { toggleCart(); setMobileOpen(false) }}
              className="flex items-center gap-2 text-lg font-medium text-[#8B949E] hover:text-[#01D7D5] transition-colors"
            >
              <ShoppingCart size={20} />
              {lang === 'ar' ? 'عربة التسوق' : lang === 'fr' ? 'Panier' : 'Cart'}
              {totalItems > 0 && (
                <span className="ml-1 w-5 h-5 bg-[#01D7D5] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-lg font-medium text-[#8B949E] hover:text-[#01D7D5] transition-colors"
            >
              <Globe size={18} />
              {lang === 'fr' ? 'Français' : lang === 'ar' ? 'العربية' : 'English'}
            </button>

            {/* Mobile Login / Dashboard */}
            <div className="border-t border-[#30363D] w-48 pt-6 mt-2">
              {isMarketerLoggedIn() ? (
                <div className="flex flex-col items-center gap-4">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-[#01D7D5] hover:text-white transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center text-[#01D7D5] text-sm font-bold">
                      {getMarketerSession()?.name?.charAt(0) || 'U'}
                    </span>
                    {lang === 'ar' ? 'لوحة التحكم' : lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => { clearMarketerSession(); setMobileOpen(false) }}
                    className="flex items-center gap-2 text-lg font-medium text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
                  >
                    <LogOut size={18} />
                    {lang === 'ar' ? 'تسجيل الخروج' : lang === 'fr' ? 'Déconnexion' : 'Logout'}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 text-lg font-medium text-[#01D7D5] hover:text-white transition-colors"
                >
                  <LogIn size={18} />
                  {lang === 'ar' ? 'تسجيل دخول المسوق' : lang === 'fr' ? 'Connexion Marketer' : 'Member Login'}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
