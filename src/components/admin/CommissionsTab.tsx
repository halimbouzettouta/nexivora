import { useState } from 'react'
import { DollarSign, CheckCircle, XCircle, Download, Wallet, PieChart, TrendingUp } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { getCommissions, getCommissionStats, type Commission } from '@/hooks/orderStore'
import { getMarketerAccounts } from '@/hooks/marketerAuth'

export default function CommissionsTab() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions')
  const allCommissions = getCommissions()
  const stats = getCommissionStats()
  const marketers = getMarketerAccounts()

  // Enrich commissions with marketer names
  const enrichedCommissions: (Commission & { marketerName: string })[] = allCommissions.map(c => {
    const m = marketers.find(mk => mk.referralCode === c.marketerReferralCode)
    return { ...c, marketerName: m?.name || c.marketerReferralCode || 'Unknown' }
  })

  const statCards = [
    { label: 'Total Earned', value: `DZD ${stats.totalEarned.toLocaleString()}`, icon: <DollarSign size={18} /> },
    { label: 'Available', value: `DZD ${Math.max(0, stats.totalEarned - 50000).toLocaleString()}`, icon: <Wallet size={18} /> },
    { label: 'Pending', value: `DZD ${stats.totalPending.toLocaleString()}`, icon: <TrendingUp size={18} /> },
    { label: 'Total Transactions', value: String(stats.count), icon: <PieChart size={18} /> },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#01D7D5]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Commission Breakdown</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#30363D" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#01D7D5" strokeWidth="12"
                  strokeDasharray={`${stats.totalEarned > 0 ? 0.65 * 251.2 : 0} ${251.2}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white text-lg font-semibold">{stats.totalEarned > 0 ? '65%' : '0%'}</span>
                <span className="text-[#484F58] text-[10px]">Direct</span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              {[
                { label: 'Direct Commission (5%)', value: `DZD ${stats.directTotal.toLocaleString()}`, percent: stats.totalEarned > 0 ? Math.round((stats.directTotal / stats.totalEarned) * 100) : 0, color: '#01D7D5' },
                { label: 'Team Bonus (5% pool)', value: `DZD ${stats.teamTotal.toLocaleString()}`, percent: stats.totalEarned > 0 ? Math.round((stats.teamTotal / stats.totalEarned) * 100) : 0, color: '#3B82F6' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{item.label}</span>
                    <span className="text-[#8B949E]">{item.value}</span>
                  </div>
                  <div className="w-full bg-[#30363D] rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Commission Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Earned', value: `DZD ${stats.totalEarned.toLocaleString()}` },
              { label: 'Total Pending', value: `DZD ${stats.totalPending.toLocaleString()}` },
              { label: 'Direct Sales', value: `DZD ${stats.directTotal.toLocaleString()}` },
              { label: 'Team Bonuses', value: `DZD ${stats.teamTotal.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#30363D]/50">
                <span className="text-[#8B949E] text-xs">{item.label}</span>
                <div className="text-right">
                  <p className="text-white text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <h3 className="text-white font-medium p-5 pb-0">Commission Transactions</h3>
        <div className="overflow-x-auto p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {['Source', 'Marketer', 'Amount', 'Type', 'Status', 'Date'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {enrichedCommissions.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[#484F58]">No commissions yet. Commissions appear when customers buy through referral links.</td></tr>
              )}
              {enrichedCommissions.map((t) => (
                <tr key={t.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white text-sm">{t.source}</td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs">{t.marketerName}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">{t.amount.toLocaleString()} DZD</td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs capitalize">{t.type}</td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
