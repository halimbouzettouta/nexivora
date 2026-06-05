import { trpc } from '@/providers/trpc'
import { Zap, Award, Trophy, Crown, Diamond } from 'lucide-react'

const rankIcons: Record<string, React.ReactNode> = {
  Starter: <Zap size={28} />,
  Silver: <Award size={28} />,
  Gold: <Trophy size={28} />,
  Platinum: <Crown size={28} />,
  Diamond: <Diamond size={28} />,
}

const rankRequirements: Record<string, string> = {
  Starter: 'Entry Level',
  Silver: 'DZD 500K personal sales',
  Gold: 'DZD 2M total sales',
  Platinum: 'DZD 5M total sales',
  Diamond: 'DZD 10M total sales',
}

const rankRewards: Record<string, string> = {
  Starter: 'Welcome Kit',
  Silver: 'Shopping Voucher',
  Gold: 'Premium Smartphone',
  Platinum: 'Electric Scooter',
  Diamond: 'Trip / Cash Bonus',
}

export default function RankSystem() {
  const { data: ranks } = trpc.rank.list.useQuery()

  return (
    <section id="ranks" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          PROGRESSION SYSTEM
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          Climb the Ranks
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[640px] mx-auto mb-14" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Earn commissions, unlock rewards, and grow your network. Every sale brings you closer to the next rank.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {ranks?.map((rank, idx) => (
            <div
              key={rank.id}
              className={`w-[220px] bg-[#161B22] rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                idx === 0 ? 'border border-[#01D7D5]' : 'border border-[#30363D]'
              }`}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${rank.color}22`, color: rank.color }}
              >
                {rankIcons[rank.name] || <Zap size={28} />}
              </div>
              <h4 className="font-semibold text-xl mb-1" style={{ color: rank.color }}>
                {rank.name}
              </h4>
              <p className="text-[#8B949E] text-xs mb-4">
                {rankRequirements[rank.name] || ''}
              </p>
              <div
                className="inline-block px-4 py-2 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${rank.color}18`, color: rank.color }}
              >
                {rankRewards[rank.name] || rank.rewardDescription}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
