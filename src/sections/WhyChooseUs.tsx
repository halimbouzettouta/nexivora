import { BatteryFull, Truck, Headphones, Zap, Award, Gauge } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const getFeatures = (t: (k: string) => string) => [
  { icon: <Zap size={28} />, title: t('why.electric'), desc: t('why.electricDesc') },
  { icon: <BatteryFull size={28} />, title: t('why.range'), desc: t('why.rangeDesc') },
  { icon: <Truck size={28} />, title: t('why.shipping'), desc: t('why.shippingDesc') },
  { icon: <Headphones size={28} />, title: t('why.support'), desc: t('why.supportDesc') },
  { icon: <Award size={28} />, title: t('why.quality'), desc: t('why.qualityDesc') },
  { icon: <Gauge size={28} />, title: t('why.fastCharge'), desc: t('why.fastChargeDesc') },
]

export default function WhyChooseUs() {
  const { t } = useLanguage()
  const features = getFeatures(t)

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('why.badge')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('why.title')}
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-14" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          {t('why.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 text-left hover:-translate-y-1 hover:border-[rgba(1,215,213,0.3)] transition-all duration-300"
            >
              <div className="text-[#01D7D5] mb-4">{f.icon}</div>
              <h4 className="text-white font-medium text-base mb-2">{f.title}</h4>
              <p className="text-[#8B949E] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
