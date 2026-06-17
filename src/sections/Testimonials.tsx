import { useLanguage } from '@/hooks/useLanguage'
import { Star } from 'lucide-react'

const getReviews = (t: (k: string) => string) => [
  { name: 'Ahmed Benali', product: 'Nexivora X1 E-Bike', rating: 5, text: t('review.text1') },
  { name: 'Karim Hadj', product: 'Nexivora Pro Scooter', rating: 5, text: t('review.text2') },
  { name: 'Yasmine Djebbar', product: 'Nexivora City E-Bike', rating: 4, text: t('review.text3') },
  { name: 'Omar Khalef', product: 'Nexivora X1 E-Bike', rating: 5, text: t('review.text4') },
  { name: 'Sofia Mansouri', product: 'Nexivora Lite Scooter', rating: 5, text: t('review.text5') },
  { name: 'Nadia Berrahal', product: 'Nexivora City E-Bike', rating: 4, text: t('review.text6') },
]

export default function Testimonials() {
  const { t } = useLanguage()
  const reviews = getReviews(t)

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#30363D] flex items-center justify-center text-white font-semibold text-sm">
                  {r.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{r.name}</p>
                  <p className="text-[#484F58] text-xs">{r.product}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-[#30363D]'} />
                  ))}
                </div>
              </div>
              <p className="text-[#8B949E] text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
