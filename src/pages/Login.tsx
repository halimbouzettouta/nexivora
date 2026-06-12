import { useState } from 'react'
import { Link } from 'react-router'
import { Zap, Globe, Lock, Shield, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { verifyAdminPassword, setAdminSession } from '@/hooks/adminAuth'

// Default admin password - shown to user for convenience
const DEFAULT_PASSWORD = 'Eride2025!'

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const { lang, setLang, t } = useLanguage()
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const handleAdminLogin = async () => {
    if (!adminPassword) {
      setLoginError(t('nav.home') === 'الرئيسية' ? 'الرجاء إدخال كلمة المرور' : 'Please enter a password')
      return
    }
    setLoggingIn(true)
    setLoginError('')

    const valid = await verifyAdminPassword(adminPassword)
    if (valid) {
      setAdminSession()
      window.location.href = '/#/admin'
      window.location.reload()
    } else {
      setLoginError(t('nav.home') === 'الرئيسية' ? 'كلمة المرور خاطئة' : `Wrong password. Try: "${DEFAULT_PASSWORD}"`)
      setLoggingIn(false)
    }
  }

  const handleResetPassword = async () => {
    // Reset to default password by clearing the stored hash
    localStorage.removeItem('eride-admin-pwd-hash')
    setLoginError('')
    setPwdSuccess(t('nav.home') === 'الرئيسية' ? 'تم إعادة تعيين كلمة المرور. حاول تسجيل الدخول مرة أخرى.' : 'Password reset to default. Try logging in again.')
    setAdminPassword(DEFAULT_PASSWORD)
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={32} className="text-[#01D7D5]" />
            <span className="text-[#01D7D5] font-semibold text-2xl tracking-[0.05em]">E-RIDE</span>
          </div>
          <h2 className="text-white font-semibold text-3xl mb-4">{t('about.subtitle')}</h2>
          <p className="text-[#8B949E] max-w-[400px] mx-auto">
            {t('about.communityText')}
          </p>
          <div
            className="mt-8 mx-auto w-[300px] h-[150px]"
            style={{
              background: 'radial-gradient(circle, rgba(1,215,213,0.3) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Zap size={24} className="text-[#01D7D5]" />
            <span className="text-[#01D7D5] font-semibold text-xl tracking-[0.05em]">E-RIDE</span>
          </div>

          <h1 className="text-white font-semibold text-2xl mb-1">{t('login.welcome')}</h1>
          <p className="text-[#8B949E] text-sm mb-8">{t('login.signin')}</p>

          {/* OAuth Login */}
          <button
            onClick={() => { window.location.href = getOAuthUrl(); }}
            className="w-full py-3.5 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
          >
            <Zap size={18} />
            {t('login.withKimi')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-[#484F58] text-xs">{t('login.or')}</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          {/* Admin Password Login */}
          {!showAdminForm ? (
            <button
              onClick={() => setShowAdminForm(true)}
              className="w-full py-3 border border-[#EF4444]/30 text-[#EF4444] font-medium rounded-lg hover:border-[#EF4444] hover:bg-[rgba(239,68,68,0.05)] transition-all duration-300 flex items-center justify-center gap-2 mb-4"
            >
              <Shield size={18} />
              {t('nav.home') === 'الرئيسية' ? 'دخول المشرف' : 'Admin Login'}
            </button>
          ) : (
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 mb-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-[#EF4444]" />
                <span className="text-white text-sm font-medium">{t('nav.home') === 'الرئيسية' ? 'لوحة تحكم المشرف' : 'Admin Panel Access'}</span>
              </div>

              {/* Password hint */}
              <p className="text-[#484F58] text-xs">
                {t('nav.home') === 'الرئيسية' ? 'كلمة المرور الافتراضية:' : 'Default password:'} <span className="text-[#8B949E] font-mono">{DEFAULT_PASSWORD}</span>
              </p>

              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setLoginError(''); setPwdSuccess('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder={t('nav.home') === 'الرئيسية' ? 'أدخل كلمة المرور...' : 'Enter admin password...'}
                className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
              />
              {pwdSuccess && (
                <p className="text-[#01D7D5] text-xs">{pwdSuccess}</p>
              )}
              {loginError && (
                <p className="text-[#EF4444] text-xs">{loginError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleAdminLogin}
                  disabled={loggingIn}
                  className="flex-1 py-2.5 bg-[#EF4444] text-white font-medium rounded-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all text-sm disabled:opacity-50"
                >
                  {loggingIn ? '...' : (t('nav.home') === 'الرئيسية' ? 'دخول' : 'Login')}
                </button>
                <button
                  onClick={() => { setShowAdminForm(false); setLoginError(''); setPwdSuccess('') }}
                  className="px-4 py-2.5 border border-[#30363D] text-[#484F58] rounded-lg hover:text-white transition-colors text-sm"
                >
                  {t('btn.cancel')}
                </button>
              </div>
              {/* Reset password link */}
              <button
                onClick={handleResetPassword}
                className="w-full flex items-center justify-center gap-1.5 text-[#484F58] text-xs hover:text-[#F59E0B] transition-colors pt-1"
              >
                <RotateCcw size={12} />
                {t('nav.home') === 'الرئيسية' ? 'نسيت كلمة المرور؟ إعادة تعيين' : 'Forgot password? Reset to default'}
              </button>
            </div>
          )}

          {/* Regular Email/Password (for marketers/customers) */}
          <div className="space-y-4">
            <div>
              <label className="text-[#8B949E] text-sm mb-1 block">{t('login.email')}</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[#8B949E] text-sm mb-1 block">{t('login.password')}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#8B949E] cursor-pointer">
                <input type="checkbox" className="rounded border-[#30363D] bg-[#161B22] text-[#01D7D5] focus:ring-[#01D7D5]" />
                {t('login.remember')}
              </label>
              <a href="#" className="text-[#01D7D5] text-sm hover:underline">{t('login.forgot')}</a>
            </div>
            <button className="w-full py-3.5 border border-[#30363D] text-white font-medium rounded-lg hover:border-[#01D7D5] transition-colors duration-300">
              {t('login.signIn')}
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Globe size={14} className="text-[#484F58]" />
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "en" ? "font-bold text-white" : ""}`} onClick={() => setLang("en")}>English</button>
            <span className="text-[#30363D]">/</span>
            <button className={`text-[#484F58] text-sm hover:text-[#01D7D5] transition-colors ${lang === "ar" ? "font-bold text-white" : ""}`} onClick={() => setLang("ar")}>العربية</button>
          </div>

          <p className="text-[#484F58] text-sm text-center mt-6">
            {t('login.noAccount')}{' '}
            <a href="#" className="text-[#01D7D5] hover:underline">{t('login.signUp')}</a>
          </p>

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