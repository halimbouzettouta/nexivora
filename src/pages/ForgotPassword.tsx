import { useState } from 'react'
import { Link } from 'react-router'
import { Globe, Lock, Mail, ArrowLeft, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { requestPasswordResetOTP, verifyPasswordResetOTP, resetPassword } from '@/hooks/marketerAuth'

type Step = 'email' | 'otp' | 'reset' | 'success'

export default function ForgotPassword() {
  const { lang, setLang } = useLanguage()
  const [step, setStep] = useState<Step>('email')
  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [displayOtp, setDisplayOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  const t = {
    title: isAr ? 'استعادة كلمة المرور' : isFr ? 'Réinitialiser le Mot de Passe' : 'Reset Password',
    subtitle: isAr ? 'أدخل اسم المستخدم لإرسال رمز التحقق' : isFr ? 'Entrez votre identifiant pour recevoir le code' : 'Enter your username to receive a verification code',
    usernameLabel: isAr ? 'اسم المستخدم' : isFr ? 'Identifiant' : 'Username',
    usernamePlaceholder: isAr ? 'أدخل اسم المستخدم' : isFr ? 'Entrez votre identifiant' : 'Enter your username',
    sendOtp: isAr ? 'إرسال رمز التحقق' : isFr ? 'Envoyer le Code' : 'Send Verification Code',
    otpSent: isAr ? 'تم إرسال رمز التحقق!' : isFr ? 'Code envoyé !' : 'Verification code sent!',
    checkOtp: isAr ? 'الرمز أدناه (محاكاة البريد الإلكتروني):' : isFr ? 'Le code ci-dessous (simulation email) :' : 'Your code below (email simulation):',
    otpLabel: isAr ? 'رمز التحقق' : isFr ? 'Code de Vérification' : 'Verification Code',
    otpPlaceholder: isAr ? 'أدخل الرمز المكون من 6 أرقام' : isFr ? 'Entrez le code à 6 chiffres' : 'Enter 6-digit code',
    verify: isAr ? 'تحقق' : isFr ? 'Vérifier' : 'Verify',
    newPasswordLabel: isAr ? 'كلمة المرور الجديدة' : isFr ? 'Nouveau Mot de Passe' : 'New Password',
    newPasswordPlaceholder: isAr ? 'أدخل كلمة مرور جديدة' : isFr ? 'Entrez un nouveau mot de passe' : 'Enter a new password',
    confirmLabel: isAr ? 'تأكيد كلمة المرور' : isFr ? 'Confirmer le Mot de Passe' : 'Confirm Password',
    confirmPlaceholder: isAr ? 'أعد إدخال كلمة المرور' : isFr ? 'Répétez le mot de passe' : 'Re-enter password',
    resetBtn: isAr ? 'تعيين كلمة المرور' : isFr ? 'Réinitialiser' : 'Reset Password',
    successTitle: isAr ? 'تم التعيين!' : isFr ? 'Réussi !' : 'Password Reset!',
    successDesc: isAr ? 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.' : isFr ? 'Mot de passe modifié. Vous pouvez maintenant vous connecter.' : 'Your password has been changed. You can now sign in.',
    backToLogin: isAr ? 'العودة لتسجيل الدخول' : isFr ? 'Retour à la Connexion' : 'Back to Login',
    resend: isAr ? 'إعادة الإرسال' : isFr ? 'Renvoyer' : 'Resend Code',
    otpError: isAr ? 'رمز غير صالح' : isFr ? 'Code invalide' : 'Invalid code',
    passwordMismatch: isAr ? 'كلمتا المرور غير متطابقتين' : isFr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match',
    passwordShort: isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : isFr ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters',
    notFound: isAr ? 'اسم المستخدم غير موجود' : isFr ? 'Identifiant non trouvé' : 'Username not found',
  }

  const handleSendOTP = () => {
    if (!username.trim()) {
      setError(isAr ? 'الرجاء إدخال اسم المستخدم' : isFr ? 'Veuillez entrer votre identifiant' : 'Please enter your username')
      return
    }
    setLoading(true)
    setError('')

    const result = requestPasswordResetOTP(username.trim())
    if (result.success && result.otp) {
      setDisplayOtp(result.otp)
      setStep('otp')
    } else {
      setError(t.notFound)
    }
    setLoading(false)
  }

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setError(isAr ? 'الرمج يجب أن يكون 6 أرقام' : isFr ? 'Le code doit contenir 6 chiffres' : 'Code must be 6 digits')
      return
    }
    setLoading(true)
    setError('')

    const result = verifyPasswordResetOTP(username, otp)
    if (result.success) {
      setStep('reset')
    } else {
      setError(result.error || t.otpError)
    }
    setLoading(false)
  }

  const handleReset = () => {
    if (newPassword.length < 6) {
      setError(t.passwordShort)
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch)
      return
    }
    setLoading(true)
    setError('')

    const result = resetPassword(username, newPassword)
    if (result.success) {
      setStep('success')
    } else {
      setError(result.error || 'Error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <img src="/nexivora-logo.png" alt="NEXIVORA" className="h-32 w-auto mx-auto mb-6" />
          <h2 className="text-white font-semibold text-3xl mb-4">
            {isAr ? 'استعادة كلمة المرور' : isFr ? 'Réinitialisation' : 'Password Recovery'}
          </h2>
          <p className="text-[#8B949E] max-w-[400px] mx-auto">
            {isAr ? 'أدخل اسم المستخدم واتبع الخطوات لإعادة تعيين كلمة المرور.' : isFr ? 'Entrez votre identifiant et suivez les étapes pour réinitialiser votre mot de passe.' : 'Enter your username and follow the steps to reset your password.'}
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src="/nexivora-logo.png" alt="NEXIVORA" className="h-28 w-auto" />
          </div>

          {/* Back link */}
          <Link to="/login" className="inline-flex items-center gap-1 text-[#484F58] text-sm hover:text-[#01D7D5] transition-colors mb-6">
            <ArrowLeft size={14} /> {t.backToLogin}
          </Link>

          <h1 className="text-white font-semibold text-2xl mb-1">{t.title}</h1>
          <p className="text-[#8B949E] text-sm mb-8">
            {step === 'email' ? t.subtitle :
             step === 'otp' ? t.otpSent :
             step === 'reset' ? (isAr ? 'أدخل كلمة المرور الجديدة' : isFr ? 'Entrez votre nouveau mot de passe' : 'Enter your new password') :
             t.successTitle}
          </p>

          {/* ─── STEP 1: EMAIL/USERNAME ─── */}
          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t.usernameLabel}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                    placeholder={t.usernamePlaceholder}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-[#EF4444] text-xs">{error}</p>}

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-3.5 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound size={18} />
                {loading ? '...' : t.sendOtp}
              </button>
            </div>
          )}

          {/* ─── STEP 2: OTP INPUT ─── */}
          {step === 'otp' && (
            <div className="space-y-4">
              {/* Simulated email display */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[#01D7D5] mb-2">
                  <Mail size={16} />
                  <span className="text-xs font-medium">
                    {isAr ? 'تم إرسال رمز التحقق إلى بريدك' : isFr ? 'Code envoyé à votre email' : 'Verification code sent to your email'}
                  </span>
                </div>
                <p className="text-[#484F58] text-xs mb-2">{t.checkOtp}</p>
                <div className="bg-black rounded-lg py-3 px-4">
                  <span className="text-white font-mono text-2xl tracking-[0.3em] font-bold">{displayOtp}</span>
                </div>
                <p className="text-[#484F58] text-[10px] mt-2">
                  {isAr ? '(في التطبيق الحقيقي، سيتم إرسال هذا الرمز إلى بريدك الإلكتروني)' : isFr ? '(Dans l\'app réelle, ce code serait envoyé à votre email)' : '(In a real app, this code would be sent to your email)'}
                </p>
              </div>

              <div>
                <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t.otpLabel}</label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                    placeholder={t.otpPlaceholder}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all text-center tracking-[0.3em] font-mono text-lg"
                  />
                </div>
              </div>

              {error && <p className="text-[#EF4444] text-xs">{error}</p>}

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                {loading ? '...' : t.verify}
              </button>

              <button
                onClick={() => { setStep('email'); setOtp(''); setError('') }}
                className="w-full py-2 text-[#484F58] text-xs hover:text-[#01D7D5] transition-colors"
              >
                {t.resend}
              </button>
            </div>
          )}

          {/* ─── STEP 3: NEW PASSWORD ─── */}
          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t.newPasswordLabel}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                    placeholder={t.newPasswordPlaceholder}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg pl-10 pr-10 py-3 focus:border-[#01D7D5] focus:outline-none transition-all"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484F58] hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t.confirmLabel}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                    placeholder={t.confirmPlaceholder}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-[#EF4444] text-xs">{error}</p>}

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3.5 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                {loading ? '...' : t.resetBtn}
              </button>
            </div>
          )}

          {/* ─── STEP 4: SUCCESS ─── */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center mx-auto">
                <ShieldCheck size={32} className="text-[#01D7D5]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{t.successTitle}</h3>
                <p className="text-[#8B949E] text-sm">{t.successDesc}</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all"
              >
                {t.backToLogin}
              </Link>
            </div>
          )}

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Globe size={14} className="text-[#484F58]" />
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "en" ? "font-bold text-white" : ""}`} onClick={() => setLang("en")}>English</button>
            <span className="text-[#30363D]">/</span>
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "ar" ? "font-bold text-white" : ""}`} onClick={() => setLang("ar")}>العربية</button>
            <span className="text-[#30363D]">/</span>
            <button className={`text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors ${lang === "fr" ? "font-bold text-white" : ""}`} onClick={() => setLang("fr")}>Français</button>
          </div>
        </div>
      </div>
    </div>
  )
}
