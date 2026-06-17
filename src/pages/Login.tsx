import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Zap, Globe, LogIn, UserPlus, KeyRound } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { verifyMarketerLogin, setMarketerSession } from '@/hooks/marketerAuth'

export default function Login() {
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!username || !password) {
      setError(lang === 'ar' ? 'الرجاء إدخال اسم المستخدم وكلمة المرور' : lang === 'fr' ? 'Veuillez entrer votre identifiant et mot de passe' : 'Please enter username and password')
      return
    }
    setLoading(true)
    setError('')

    const account = verifyMarketerLogin(username, password)
    if (account) {
      setMarketerSession(account)
      navigate('/dashboard')
    } else {
      setError(lang === 'ar' ? 'اسم المستخدم أو كلمة المرور خاطئة' : lang === 'fr' ? 'Identifiant ou mot de passe incorrect' : 'Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/nexivora-logo.png" alt="NEXIVORA" className="h-32 w-auto" />
          </div>
          <h2 className="text-white font-semibold text-3xl mb-4">{t('about.subtitle')}</h2>
          <p className="text-[#8B949E] max-w-[400px] mx-auto">{t('about.communityText')}</p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src="/nexivora-logo.png" alt="NEXIVORA" className="h-28 w-auto" />
          </div>

          <h1 className="text-white font-semibold text-2xl mb-1">{t('login.welcome')}</h1>
          <p className="text-[#8B949E] text-sm mb-8">
            {lang === 'ar' ? 'تسجيل دخول المسوق' : lang === 'fr' ? 'Connexion Marketer' : 'Marketer Sign In'}
          </p>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">
                {lang === 'ar' ? 'اسم المستخدم' : lang === 'fr' ? 'Identifiant' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : lang === 'fr' ? 'Entrez votre identifiant' : 'Enter username'}
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">
                {lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : lang === 'fr' ? 'Entrez le mot de passe' : 'Enter password'}
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all"
              />
            </div>

            {error && <p className="text-[#EF4444] text-xs">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {loading ? '...' : (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In')}
            </button>

            {/* Forgot Password */}
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1 text-[#01D7D5] text-xs hover:underline transition-colors"
            >
              <KeyRound size={12} />
              {lang === 'ar' ? 'نسيت كلمة المرور؟' : lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-[#484F58] text-xs">{t('login.or')}</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          {/* Join as Marketer */}
          <Link
            to="/register"
            className="w-full py-3 border border-[#30363D] text-[#8B949E] font-medium rounded-lg hover:border-[#01D7D5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            {lang === 'ar' ? 'انضم كمسوق' : lang === 'fr' ? 'Devenir Marketer' : 'Join as Marketer'}
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Globe size={14} className="text-[#484F58]" />
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "en" ? "font-bold text-white" : ""}`} onClick={() => setLang("en")}>English</button>
            <span className="text-[#30363D]">/</span>
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "ar" ? "font-bold text-white" : ""}`} onClick={() => setLang("ar")}>العربية</button>
            <span className="text-[#30363D]">/</span>
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "fr" ? "font-bold text-white" : ""}`} onClick={() => setLang("fr")}>Français</button>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors block">
              {t('login.back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
