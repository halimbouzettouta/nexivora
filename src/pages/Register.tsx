import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useLanguage } from '@/hooks/useLanguage'
import {
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Users,
  ArrowRight,
  LogIn,
  MapPin,
  Zap,
} from 'lucide-react'

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

function setRefCookie(code: string) {
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  document.cookie = `eride_ref=${code}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export default function Register() {
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const refCode = searchParams.get('ref') || ''
  const [manualCode, setManualCode] = useState('')

  // Validate referral code
  const { data: validation, isLoading: validating } = trpc.referral.validate.useQuery(
    { code: refCode },
    { enabled: refCode.length > 0 }
  )

  // Get referrer stats
  const { data: stats } = trpc.referral.getStats.useQuery(
    { code: refCode },
    { enabled: validation?.valid === true }
  )

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  // Handle manual code submission
  const handleManualCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      setSearchParams({ ref: manualCode.trim() })
    }
  }

  // Handle join - set cookie and redirect to OAuth
  const handleJoin = () => {
    if (refCode && validation?.valid) {
      setRefCookie(refCode)
      window.location.href = getOAuthUrl()
    }
  }

  // ─── NO REFERRAL CODE STATE ───
  if (!refCode) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center px-4">
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
            <Link
              to="/dealers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
            >
              <MapPin size={16} />
              {t('register.noRefAction')}
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
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={40} className="text-[#01D7D5] animate-spin mx-auto mb-4" />
          <p className="text-[#8B949E]">{t('register.loading')}</p>
        </div>
      </div>
    )
  }

  // ─── INVALID CODE STATE ───
  if (!validating && validation && !validation.valid) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center px-4">
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
              <button
                type="submit"
                className="px-5 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors">
            {t('login.back')}
          </Link>
        </div>
      </div>
    )
  }

  // ─── VALID REFERRAL STATE ───
  const referrer = validation?.referrer

  return (
    <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center px-4">
      <div className="max-w-[460px] w-full">
        {/* Referrer Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center">
              <Zap size={24} className="text-[#01D7D5]" />
            </div>
            <div>
              <p className="text-[#484F58] text-xs">{t('register.refFrom')}</p>
              <h3 className="text-white font-semibold text-lg">{referrer?.name}</h3>
              <p className="text-[#01D7D5] text-xs">{t('register.refNetwork')}</p>
            </div>
          </div>

          {stats?.stats && (
            <div className="grid grid-cols-2 gap-3 border-t border-[#30363D] pt-4">
              <div className="text-center">
                <p className="text-white font-semibold text-xl">{stats.stats.directCount}</p>
                <p className="text-[#484F58] text-[10px] uppercase tracking-wider">{t('register.directRefs')}</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-xl">{stats.stats.totalTeam}</p>
                <p className="text-[#484F58] text-[10px] uppercase tracking-wider">{t('register.totalRefs')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Join Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-[rgba(1,215,213,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={28} className="text-[#01D7D5]" />
          </div>
          <h2 className="text-white font-semibold text-2xl mb-2">{t('register.title')}</h2>
          <p className="text-[#8B949E] text-sm mb-6">{t('register.joinDesc')}</p>

          <button
            onClick={handleJoin}
            className="w-full py-4 bg-[#01D7D5] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
          >
            <UserPlus size={20} />
            {t('register.joinBtn')}
          </button>

          <p className="text-[#484F58] text-xs">
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
