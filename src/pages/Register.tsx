import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useLanguage } from '@/hooks/useLanguage'
import { findMarketerByReferralCode, registerMarketerAccount, setMarketerSession } from '@/hooks/marketerAuth'
import { addCommission } from '@/hooks/orderStore'
import {
  UserPlus,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Mail,
  Zap,
  CheckCircle,
  Lock,
  User,
} from 'lucide-react'

export default function Register() {
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || ''
  const [manualCode, setManualCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [referrer, setReferrer] = useState<{ name: string; referralCode: string; rank: string } | null>(null)
  const [invalid, setInvalid] = useState(false)

  // Registration form state
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [newAccount, setNewAccount] = useState<{ name: string; username: string; referralCode: string } | null>(null)

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  // Validate referral code client-side
  const handleManualCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      setSearchParams({ ref: manualCode.trim() })
    }
  }

  // Check referral code on mount / change
  useEffect(() => {
    if (refCode) {
      // Special founder code — allows first account creation without a referrer
      if (refCode === 'NXADMIN') {
        setReferrer({ name: 'Founder', referralCode: 'NXADMIN', rank: 'Diamond' })
        setInvalid(false)
        setValidating(false)
        return
      }
      setValidating(true)
      setInvalid(false)
      setReferrer(null)
      const timer = setTimeout(() => {
        const found = findMarketerByReferralCode(refCode)
        if (found) {
          setReferrer({ name: found.name, referralCode: found.referralCode, rank: found.rank })
        } else {
          setInvalid(true)
        }
        setValidating(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [refCode])

  // Handle registration
  const handleRegister = () => {
    setRegError('')

    if (!name.trim() || !username.trim() || !password.trim()) {
      setRegError(isAr ? 'جميع الحقول مطلوبة' : isFr ? 'Tous les champs sont requis' : 'All fields are required')
      return
    }
    if (password !== confirmPassword) {
      setRegError(isAr ? 'كلمات المرور غير متطابقة' : isFr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }
    if (password.length < 6) {
      setRegError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : isFr ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters')
      return
    }

    // NXADMIN is the founder bypass — no parent referrer
    const actualRef = refCode === 'NXADMIN' ? undefined : refCode
    const result = registerMarketerAccount(name.trim(), username.trim(), password, actualRef)
    if (result.success && result.account) {
      // Create team commission for parent when someone joins via referral
      if (result.parentReferralCode) {
        addCommission({
          id: `team-${Date.now()}`,
          source: `New team member: ${name}`,
          amount: 5000,
          type: 'team',
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          marketerReferralCode: result.parentReferralCode,
        })
      }
      setMarketerSession(result.account)
      setNewAccount({
        name: result.account.name,
        username: result.account.username,
        referralCode: result.account.referralCode,
      })
      setRegistered(true)
    } else {
      setRegError(result.error || 'Registration failed')
    }
  }

  // ─── NO REFERRAL CODE STATE ───
  if (!refCode) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full text-center">
          <div className="w-20 h-20 bg-[rgba(245,158,11,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-[#F59E0B]" />
          </div>
          <h1 className="text-white font-semibold text-3xl mb-3">{t('register.noRef')}</h1>
          <p className="text-[#8B949E] leading-relaxed mb-8">{t('register.noRefDesc')}</p>

          {/* Manual code entry */}
          <form onSubmit={handleManualCode} className="mb-6">
            <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t('register.enterCode')}</label>
            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('register.codeLabel')}
                className="flex-1 bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all text-center tracking-widest uppercase"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <button
              onClick={() => setSearchParams({ ref: 'NXADMIN' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
            >
              <Zap size={16} />
              {isAr ? 'إنشاء أول حساب' : isFr ? 'Créer le Premier Compte' : 'Create First Account'}
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#30363D] text-[#8B949E] font-medium rounded-lg hover:border-[#01D7D5] hover:text-[#01D7D5] transition-all"
            >
              <Mail size={16} />
              {isAr ? 'طلب كود إحالة' : isFr ? 'Demander un Code' : 'Request a Referral Code'}
            </Link>
          </div>
          <p className="text-[#484F58] text-xs mt-6">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-[#01D7D5] hover:underline">{t('register.loginLink')}</Link>
          </p>
        </div>
      </div>
    )
  }

  // ─── LOADING STATE ───
  if (validating) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={40} className="text-[#01D7D5] animate-spin mx-auto mb-4" />
          <p className="text-[#8B949E]">{t('register.loading')}</p>
        </div>
      </div>
    )
  }

  // ─── INVALID CODE STATE ───
  if (invalid) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full text-center">
          <div className="w-20 h-20 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-[#EF4444]" />
          </div>
          <h1 className="text-white font-semibold text-3xl mb-3">{t('register.invalid')}</h1>
          <p className="text-[#8B949E] leading-relaxed mb-6">{t('register.invalidDesc')}</p>
          <p className="text-[#484F58] text-sm mb-6 font-mono">{refCode}</p>

          <form onSubmit={handleManualCode} className="mb-6">
            <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">{t('register.enterCode')}</label>
            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('register.codeLabel')}
                className="flex-1 bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all text-center tracking-widest uppercase"
              />
              <button type="submit" className="px-5 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors">{t('login.back')}</Link>
        </div>
      </div>
    )
  }

  // ─── SUCCESS STATE ───
  if (registered && newAccount) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full text-center">
          <div className="w-20 h-20 bg-[rgba(1,215,213,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-[#01D7D5]" />
          </div>
          <h1 className="text-white font-semibold text-3xl mb-3">{t('register.success')}</h1>
          <p className="text-[#8B949E] leading-relaxed mb-6">{t('register.successDesc')}</p>

          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 mb-6 text-left">
            <p className="text-[#484F58] text-xs mb-1">{isAr ? 'اسمك' : isFr ? 'Votre nom' : 'Your Name'}</p>
            <p className="text-white font-medium mb-3">{newAccount.name}</p>
            <p className="text-[#484F58] text-xs mb-1">{isAr ? 'اسم المستخدم' : isFr ? 'Identifiant' : 'Username'}</p>
            <p className="text-white font-medium mb-3 font-mono">{newAccount.username}</p>
            <p className="text-[#484F58] text-xs mb-1">{isAr ? 'رمز الإحالة الخاص بك' : isFr ? 'Votre Code de Parrainage' : 'Your Referral Code'}</p>
            <p className="text-[#01D7D5] font-semibold font-mono">{newAccount.referralCode}</p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
          >
            {isAr ? 'الذهاب للوحة التحكم' : isFr ? 'Aller au Tableau de Bord' : 'Go to Dashboard'}
          </Link>
        </div>
      </div>
    )
  }

  // ─── VALID REFERRAL + REGISTRATION FORM ───
  return (
    <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center px-4">
      <div className="max-w-[460px] w-full">
        {/* Referrer Card */}
        {referrer && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center">
                <Zap size={24} className="text-[#01D7D5]" />
              </div>
              <div>
                <p className="text-[#484F58] text-xs">{t('register.refFrom')}</p>
                <h3 className="text-white font-semibold text-lg">{referrer.name}</h3>
                <p className="text-[#01D7D5] text-xs">{referrer.rank} &middot; {referrer.referralCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-1 text-center">{t('register.title')}</h2>
          <p className="text-[#8B949E] text-sm text-center mb-6">{t('register.subtitle')}</p>

          <div className="space-y-4">
            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-1.5">
                {isAr ? 'الاسم الكامل' : isFr ? 'Nom Complet' : 'Full Name'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input
                  value={name} onChange={(e) => { setName(e.target.value); setRegError('') }}
                  placeholder={isAr ? 'أحمد' : isFr ? 'Jean Dupont' : 'John Doe'}
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-1.5">
                {isAr ? 'اسم المستخدم' : isFr ? 'Identifiant' : 'Username'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input
                  value={username} onChange={(e) => { setUsername(e.target.value); setRegError('') }}
                  placeholder={isAr ? 'أحمد123' : isFr ? 'jean2025' : 'johndoe'}
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-1.5">
                {isAr ? 'كلمة المرور' : isFr ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input
                  type="password" value={password} onChange={(e) => { setPassword(e.target.value); setRegError('') }}
                  placeholder="••••••"
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-1.5">
                {isAr ? 'تأكيد كلمة المرور' : isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input
                  type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setRegError('') }}
                  placeholder="••••••"
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg pl-10 pr-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
              </div>
            </div>

            {regError && (
              <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg p-3">
                <p className="text-[#EF4444] text-xs">{regError}</p>
                {regError.includes('already exists') && (
                  <button
                    onClick={() => {
                      if (confirm('This will delete ALL accounts and start fresh. Are you sure?')) {
                        localStorage.removeItem('nxv-accounts')
                        localStorage.removeItem('nxv-session')
                        localStorage.removeItem('nxv-orders')
                        localStorage.removeItem('nxv-commissions')
                        setRegError('All data cleared. You can now register fresh.')
                        setTimeout(() => window.location.reload(), 1500)
                      }
                    }}
                    className="text-[#F59E0B] text-xs mt-2 hover:underline"
                  >
                    {isAr ? 'مسح جميع البيانات وبدء جديد' : isFr ? 'Tout effacer et recommencer' : 'Clear all data and start fresh'}
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleRegister}
              className="w-full py-4 bg-[#01D7D5] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              {t('register.joinBtn')}
            </button>
          </div>

          <p className="text-[#484F58] text-xs text-center mt-4">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-[#01D7D5] hover:underline">{t('register.loginLink')}</Link>
          </p>
        </div>

        {/* Ref code badge */}
        <div className="mt-4 text-center">
          <span className="inline-block bg-[#0A0A0A] border border-[#30363D] text-[#484F58] text-xs font-mono px-3 py-1.5 rounded-lg">
            REF: {refCode}
          </span>
        </div>
      </div>
    </div>
  )
}
