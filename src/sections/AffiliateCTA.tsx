import { Link } from 'react-router'

import { useLanguage } from '@/hooks/useLanguage'

export default function AffiliateCTA() {
  const { t } = useLanguage()
  return (
    <section className="w-full bg-[#0A0A0A] py-24 px-4 sm:px-6 lg:px-[5vw] text-center">
      <h2
        className="text-white font-semibold leading-tight tracking-[-0.02em] mb-4"
        style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
      >
        Earn 5% Commission on Every Sale
      </h2>
      <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-10" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
        Plus unlock team performance bonuses as you climb the ranks. Join hundreds of marketers already earning with E-Ride Algeria.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
        <Link
          to="/dashboard"
          className="px-10 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('hero.join')}
        </Link>
        <Link
          to="/about"
          className="px-10 py-4 border border-[#30363D] text-white font-medium rounded-lg hover:border-[#01D7D5] transition-colors duration-300"
        >
          Learn More
        </Link>
      </div>
      <p className="font-mono text-sm text-[#484F58]">
        5% Direct Commission · 5% Team Bonus · Weekly Payouts
      </p>
    </section>
  )
}
