import { trpc } from '@/providers/trpc'
import { Check } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const planMeta = [
  { recommended: false },
  { recommended: true },
  { recommended: false },
]

const FALLBACK_PLANS = [
  {
    id: 1, name: 'Basic Maintenance', price: '2500', billingCycle: 'monthly',
    description: 'Essential monthly maintenance to keep your ride in good condition.',
    features: ['Monthly inspection', '10% discount on parts', 'Priority scheduling'],
  },
  {
    id: 2, name: 'Premium Maintenance', price: '5000', billingCycle: 'monthly',
    description: 'Comprehensive care package with weekly check-ups and emergency support.',
    features: ['Weekly check-ups', '24/7 emergency support', '20% parts discount', 'Free pick-up & delivery'],
  },
  {
    id: 3, name: 'Extended Warranty', price: '15000', billingCycle: 'one_time',
    description: 'One-year extended warranty coverage for complete peace of mind.',
    features: ['1 additional year of coverage', 'Full parts replacement', 'Free labor', 'Transferable'],
  },
]

// Translation mapping for known plan data from API
const PLAN_NAME_KEYS: Record<string, string> = {
  'Extended Warranty': 'plan.extendedWarranty',
  'Premium Maintenance': 'plan.premiumMaintenance',
  'Basic Maintenance': 'plan.basicMaintenance',
}

const PLAN_DESC_KEYS: Record<string, string> = {
  'One-year extended warranty coverage for complete peace of mind.': 'plan.warrantyDesc',
  'Comprehensive care package with weekly check-ups and emergency support.': 'plan.premiumDesc',
  'Essential monthly maintenance to keep your ride in good condition.': 'plan.basicDesc',
}

const FEATURE_KEYS: Record<string, string> = {
  '1 additional year of coverage': 'plan.featureCov1',
  '2 additional years of coverage': 'plan.featureCov2',
  'Weekly check-ups': 'plan.featureWeekly',
  '24/7 emergency support': 'plan.featureEmergency',
  'Monthly inspection': 'plan.featureMonthly',
  '10% discount on parts': 'plan.featureDiscount',
  'Priority scheduling': 'plan.featurePriority',
  'Free pick-up & delivery': 'plan.featurePickup',
  'Free labor on repairs': 'plan.featureLabor',
  'Annual deep service': 'plan.featureAnnual',
}

export default function SubscriptionPlans() {
  const { t, lang } = useLanguage()
  const { data: apiPlans } = trpc.subscription.list.useQuery()
  const isFr = lang === 'fr'
  const isAr = lang === 'ar'
  const plans = apiPlans && apiPlans.length > 0 ? apiPlans : FALLBACK_PLANS

  // Helper to translate plan data
  const getPlanName = (name: string) => {
    const key = PLAN_NAME_KEYS[name]
    return key ? t(key) : name
  }

  const getPlanDesc = (desc: string) => {
    const key = PLAN_DESC_KEYS[desc]
    return key ? t(key) : desc
  }

  const getFeature = (feature: string) => {
    const key = FEATURE_KEYS[feature]
    return key ? t(key) : feature
  }

  const yearLabel = isAr ? '+1 سنة' : isFr ? '+1 AN' : '+1 YEAR'

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1000px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('section.subBadge')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('section.subTitle')}
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-14" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          {t('section.subDesc')}
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {plans?.map((plan, idx) => {
            const features = plan.features ? (typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features) as string[] : []
            const isRec = planMeta[idx]?.recommended || false
            return (
              <div
                key={plan.id}
                className={`w-[300px] bg-[#161B22] rounded-xl p-8 text-left ${
                  isRec ? 'border border-[#01D7D5]' : 'border border-[#30363D]'
                }`}
              >
                {isRec && (
                  <span className="inline-block bg-[#01D7D5] text-black text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded mb-4">
                    {t('section.recommended')}
                  </span>
                )}
                {plan.billingCycle === 'one_time' && (
                  <span className="inline-block bg-[#30363D] text-white text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded mb-4">
                    {yearLabel}
                  </span>
                )}
                <h4 className="text-white font-medium text-lg mb-2">{getPlanName(plan.name)}</h4>
                <p className="text-[#01D7D5] font-semibold text-2xl mb-4">
                  {parseFloat(plan.price).toLocaleString()} DZD
                  {plan.billingCycle === 'monthly' && <span className="text-sm text-[#8B949E]">/{isFr ? 'mois' : isAr ? 'شهر' : 'mo'}</span>}
                </p>
                <p className="text-[#8B949E] text-sm mb-6">{getPlanDesc(plan.description)}</p>
                <ul className="space-y-3 mb-6">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                      <Check size={16} className="text-[#01D7D5] flex-shrink-0" />
                      {getFeature(f)}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${
                    isRec
                      ? 'bg-[#01D7D5] text-black hover:shadow-[0_0_20px_rgba(1,215,213,0.4)]'
                      : 'border border-[#30363D] text-white hover:border-[#01D7D5]'
                  }`}
                >
                  {plan.billingCycle === 'one_time' ? t('section.purchase') : t('section.subscribe')}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
