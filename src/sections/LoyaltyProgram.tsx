import { Star, Gift, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const getHowItWorks = (t: (k: string) => string, isAr: boolean, isFr: boolean) => [
  { icon: <Star size={32} />, title: t('section.earnPoints'), desc: t('section.earnPointsDesc') },
  { icon: <Gift size={32} />, title: t('section.redeemRewards'), desc: t('section.redeemDesc') },
  { icon: <TrendingUp size={32} />, title: t('section.levelUp'), desc: t('section.levelUpDesc') },
]

const pointsTableEn = [
  { points: '500 pts', reward: 'DZD 2,500 discount' },
  { points: '1,000 pts', reward: 'Free helmet or lock' },
  { points: '2,500 pts', reward: 'Free maintenance (1 year)' },
  { points: '5,000 pts', reward: 'DZD 50,000 discount on next purchase' },
]

const pointsTableAr = [
  { points: '500 نقطة', reward: 'خصم 2,500 دج' },
  { points: '1,000 نقطة', reward: 'خوذة أو قفل مجاني' },
  { points: '2,500 نقطة', reward: 'صيانة مجانية (سنة)' },
  { points: '5,000 نقطة', reward: 'خصم 50,000 دج على الشراء التالي' },
]

const pointsTableFr = [
  { points: '500 pts', reward: 'Réduction de 2 500 DZD' },
  { points: '1 000 pts', reward: 'Casque ou antivol gratuit' },
  { points: '2 500 pts', reward: 'Maintenance gratuite (1 an)' },
  { points: '5 000 pts', reward: 'Réduction de 50 000 DZD' },
]

export default function LoyaltyProgram() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  const howItWorks = getHowItWorks(t, isAr, isFr)
  const pointsTable = isAr ? pointsTableAr : isFr ? pointsTableFr : pointsTableEn

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('section.loyaltyBadge')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('section.loyaltyTitle')}
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-14" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          {t('section.loyaltyDesc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px] mx-auto mb-12">
          {howItWorks.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="text-[#01D7D5] mb-4">{item.icon}</div>
              <h4 className="text-white font-medium text-lg mb-2">{item.title}</h4>
              <p className="text-[#8B949E] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-[700px] mx-auto">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 bg-[#0A0A0A] text-[#484F58] text-xs uppercase tracking-wider font-medium p-4 border-b border-[#30363D]">
              <span>{t('section.points')}</span>
              <span>{t('section.reward')}</span>
            </div>
            {pointsTable.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-2 p-4 text-sm ${
                  idx % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#161B22]'
                }`}
              >
                <span className="text-white font-medium">{row.points}</span>
                <span className="text-[#8B949E]">{row.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
