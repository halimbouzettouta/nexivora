import { useState } from 'react'
import { Link } from 'react-router'
import { Zap, Globe, UserPlus, Shield, LogIn } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

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

  const handleSignIn = () => {
    window.location.href = getOAuthUrl()
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

      {/* Right - Options */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Zap size={24} className="text-[#01D7D5]" />
            <span className="text-[#01D7D5] font-semibold text-xl tracking-[0.05em]">E-RIDE</span>
          </div>

          <h1 className="text-white font-semibold text-2xl mb-1">{t('login.welcome')}</h1>
          <p className="text-[#8B949E] text-sm mb-8">{lang === 'ar' ? 'اختر كيف تريد المتابعة' : lang === 'fr' ? 'Choisissez comment continuer' : 'Choose how to continue'}</p>

          {/* Join as Marketer - Main CTA */}
          <Link
            to="/register"
            className="w-full py-4 bg-[#01D7D5] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
          >
            <UserPlus size={20} />
            {lang === 'ar' ? 'انضم كمسوق' : lang === 'fr' ? 'Devenir Marketer' : 'Join as Marketer'}
          </Link>

          <p className="text-[#8B949E] text-xs text-center mb-4 px-4">
            {lang === 'ar' ? 'تحتاج رابط إحالة من مسوق حالي للانضمام' : lang === 'fr' ? 'Un lien de parrainage est requis pour rejoindre' : 'A referral link from an existing marketer is required to join'}
          </p>

          {/* Sign In for existing marketers */}
          <button
            onClick={handleSignIn}
            className="w-full py-3 border border-[#30363D] text-[#8B949E] font-medium rounded-lg hover:border-[#01D7D5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mb-6"
          >
            <LogIn size={18} />
            {lang === 'ar' ? 'تسجيل دخول مسوق' : lang === 'fr' ? 'Connexion Marketer' : 'Sign In as Marketer'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-[#484F58] text-xs">{t('login.or')}</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          {/* Admin Login */}
          <Link
            to="/admin-login"
            className="w-full py-3 border border-[#EF4444]/30 text-[#EF4444] font-medium rounded-lg hover:border-[#EF4444] hover:bg-[rgba(239,68,68,0.05)] transition-all duration-300 flex items-center justify-center gap-2 mb-6"
          >
            <Shield size={18} />
            {lang === 'ar' ? 'دخول المشرف' : lang === 'fr' ? 'Connexion Admin' : 'Admin Login'}
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
