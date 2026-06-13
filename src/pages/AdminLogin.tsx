import { useState } from 'react'
import { Link } from 'react-router'
import { Zap, Lock, Shield, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { verifyAdminPassword, setAdminSession } from '@/hooks/adminAuth'

// Default admin password - shown to user for convenience
const DEFAULT_PASSWORD = 'Eride2025!'

export default function AdminLogin() {
  const { lang, t } = useLanguage()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = async () => {
    if (!password) {
      setError(lang === 'ar' ? 'الرجاء إدخال كلمة المرور' : lang === 'fr' ? 'Veuillez entrer un mot de passe' : 'Please enter a password')
      return
    }
    setLoggingIn(true)
    setError('')

    const valid = await verifyAdminPassword(password)
    if (valid) {
      setAdminSession()
      window.location.href = '/#/admin'
      window.location.reload()
    } else {
      setError(lang === 'ar' ? 'كلمة المرور خاطئة' : lang === 'fr' ? 'Mot de passe incorrect' : 'Wrong password')
      setLoggingIn(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('eride-admin-pwd-hash')
    setError('')
    setSuccess(lang === 'ar' ? 'تم إعادة تعيين كلمة المرور. حاول مرة أخرى.' : lang === 'fr' ? 'Mot de passe réinitialisé. Essayez de vous reconnecter.' : 'Password reset to default. Try logging in again.')
    setPassword(DEFAULT_PASSWORD)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-[#EF4444]" />
          </div>
          <h1 className="text-white font-semibold text-2xl mb-1">
            {lang === 'ar' ? 'دخول المشرف' : lang === 'fr' ? 'Connexion Admin' : 'Admin Login'}
          </h1>
          <p className="text-[#8B949E] text-sm">
            {lang === 'ar' ? 'لوحة تحكم إي-رايد - دخول حصري' : lang === 'fr' ? 'Panneau Admin E-Ride - Accès Restreint' : 'E-Ride Admin Panel - Restricted Access'}
          </p>
        </div>

        {/* Password Form */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-[#EF4444]" />
            <span className="text-white text-sm font-medium">
              {lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de passe' : 'Password'}
            </span>
          </div>

          {/* Password hint */}
          <p className="text-[#484F58] text-xs">
            {lang === 'ar' ? 'الافتراضي:' : lang === 'fr' ? 'Par défaut :' : 'Default:'} <span className="text-[#8B949E] font-mono">{DEFAULT_PASSWORD}</span>
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); setSuccess('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder={lang === 'ar' ? 'أدخل كلمة المرور...' : lang === 'fr' ? 'Entrez le mot de passe...' : 'Enter password...'}
            className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
          />

          {success && (
            <p className="text-[#01D7D5] text-xs">{success}</p>
          )}
          {error && (
            <p className="text-[#EF4444] text-xs">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loggingIn}
            className="w-full py-3 bg-[#EF4444] text-white font-medium rounded-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50"
          >
            {loggingIn ? '...' : (lang === 'ar' ? 'دخول' : lang === 'fr' ? 'Connexion' : 'Login')}
          </button>

          {/* Reset password link */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 text-[#484F58] text-xs hover:text-[#F59E0B] transition-colors pt-1"
          >
            <RotateCcw size={12} />
            {lang === 'ar' ? 'نسيت كلمة المرور؟ إعادة تعيين' : lang === 'fr' ? 'Mot de passe oublié ? Réinitialiser' : 'Forgot password? Reset to default'}
          </button>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors block">
            {t('login.back')}
          </Link>
          <Link to="/login" className="text-[#484F58] text-xs hover:text-[#01D7D5] transition-colors block">
            {lang === 'ar' ? '← صفحة تسجيل الدخول العامة' : lang === 'fr' ? '← Page de connexion générale' : '← General login page'}
          </Link>
        </div>
      </div>
    </div>
  )
}
