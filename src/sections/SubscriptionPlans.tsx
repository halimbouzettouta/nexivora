import { trpc } from '@/providers/trpc'
import { Check } from 'lucide-react'

const planMeta = [
  { recommended: false },
  { recommended: true },
  { recommended: false },
]

export default function SubscriptionPlans() {
  const { data: plans } = trpc.subscription.list.useQuery()

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1000px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          MAINTENANCE &amp; WARRANTY
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          Protect Your Investment
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-14" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Choose a plan that keeps your ride in perfect condition.
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
                    RECOMMENDED
                  </span>
                )}
                {plan.billingCycle === 'one_time' && (
                  <span className="inline-block bg-[#30363D] text-white text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded mb-4">
                    +1 YEAR
                  </span>
                )}
                <h4 className="text-white font-medium text-lg mb-2">{plan.name}</h4>
                <p className="text-[#01D7D5] font-semibold text-2xl mb-4">
                  {parseFloat(plan.price).toLocaleString()} DZD
                  {plan.billingCycle === 'monthly' && <span className="text-sm text-[#8B949E]">/mo</span>}
                </p>
                <p className="text-[#8B949E] text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                      <Check size={16} className="text-[#01D7D5] flex-shrink-0" />
                      {f}
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
                  {plan.billingCycle === 'one_time' ? 'Purchase' : 'Subscribe'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
