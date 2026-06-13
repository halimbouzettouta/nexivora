import { useRef, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

const rankColors: Record<string, string> = {
  Starter: '#01D7D5',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Diamond: '#B9F2FF',
}

const getTestimonials = (t: (k: string) => string) => [
  { name: 'Ahmed Benali', rank: 'Gold', earnings: '485,000', quote: t('testimonial.quote1') },
  { name: 'Karim Hadj', rank: 'Platinum', earnings: '1,250,000', quote: t('testimonial.quote2') },
  { name: 'Yasmine Djebbar', rank: 'Silver', earnings: '180,000', quote: t('testimonial.quote3') },
  { name: 'Omar Khalef', rank: 'Diamond', earnings: '2,800,000', quote: t('testimonial.quote4') },
  { name: 'Sofia Mansouri', rank: 'Gold', earnings: '620,000', quote: t('testimonial.quote5') },
  { name: 'Nadia Berrahal', rank: 'Silver', earnings: '240,000', quote: t('testimonial.quote6') },
]

const marketerNames = ['Ahmed Benali', 'Karim Hadj', 'Yasmine Djebbar', 'Omar Khalef', 'Sofia Mansouri', 'Nadia Berrahal', 'Farid Taleb', 'Amel Chenouf', 'Rachid Meziane', 'Lina Bouzid']

export default function Testimonials() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const testimonials = getTestimonials(t)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let pos = 0
    let raf: number
    const step = () => {
      pos += 0.3
      if (pos >= el.scrollHeight / 2) pos = 0
      el.scrollTop = pos
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4 text-center">
          {t('testimonials.title')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-12 text-center"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('testimonials.subtitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((tm) => (
            <div key={tm.name} className="bg-[#161B22] border border-[#30363D] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#30363D] flex items-center justify-center text-white font-semibold text-sm">
                  {tm.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{tm.name}</p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${rankColors[tm.rank]}18`, color: rankColors[tm.rank] }}
                  >
                    {tm.rank}
                  </span>
                </div>
                <span className="ml-auto text-[#01D7D5] font-semibold text-sm">
                  DZD {tm.earnings}
                </span>
              </div>
              <p className="text-[#8B949E] text-sm italic leading-relaxed">&ldquo;{tm.quote}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Scrolling Names Marquee */}
        <div className="h-60 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="animate-scroll">
              {[...marketerNames, ...marketerNames].map((name, idx) => (
                <div
                  key={idx}
                  className="text-4xl md:text-5xl font-bold py-3 text-white text-center"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
