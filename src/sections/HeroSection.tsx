import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import BinaryRainCanvas from '@/components/BinaryRainCanvas'
import { useLanguage } from '@/hooks/useLanguage'

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const { t, lang } = useLanguage()

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const children = el.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      child.style.opacity = '0'
      child.style.animation = `fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + i * 0.2}s forwards`
    }
  }, [])

  const subtitle = lang === 'ar'
    ? 'دراجات و سكوترات كهربائية فاخرة مصممة للطريق. شحن مجاني وضمان شامل.'
    : lang === 'fr'
      ? 'Vélos et trottinettes électriques premium conçus pour la route. Livraison gratuite et garantie complète.'
      : 'Premium electric bikes and scooters built for the road ahead. Free shipping & full warranty.'

  return (
    <section className="relative w-full min-h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      <BinaryRainCanvas />

      {/* Fallback hero image layer (subtle, behind content) */}
      <div
        className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
        }}
      />

      {/* Cyan glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(1,215,213,0.15) 0%, transparent 60%)',
        }}
      />

      <div ref={contentRef} className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-6">
          {t('hero.badge')}
        </p>
        <h1
          className="text-white font-semibold leading-none tracking-[-0.03em] mb-6"
          style={{ fontSize: 'clamp(42px, 8vw, 96px)' }}
        >
          {t('hero.title')}
        </h1>
        <p
          className="text-[#8B949E] leading-relaxed max-w-[520px] mx-auto mb-10"
          style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}
        >
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/store"
            className="px-9 py-3.5 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('hero.shop')}
          </Link>
          <Link
            to="/dealers"
            className="px-9 py-3.5 border border-[#30363D] text-white font-medium rounded-lg hover:border-[#01D7D5] hover:text-[#01D7D5] transition-all duration-300"
          >
            {lang === 'ar' ? 'ابحث عن موزع' : lang === 'fr' ? 'Trouver un Concessionnaire' : 'Find a Dealer'}
          </Link>
        </div>
      </div>
    </section>
  )
}
