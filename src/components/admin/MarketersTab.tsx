import { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, TrendingUp, Users, Award, CheckCircle, Trash2, Link as LinkIcon } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { getMarketerAccounts, getDirectReferrals, type MarketerAccount } from '@/hooks/marketerAuth'

const RANKS = ['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond']
const RANK_COLORS: Record<string, string> = {
  Starter: '#8B949E', Silver: '#C0C0C0', Gold: '#FFD700', Platinum: '#E5E4E2', Diamond: '#B9F2FF',
}

export default function MarketersTab() {
  const [marketers, setMarketers] = useState<MarketerAccount[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [rankFilter, setRankFilter] = useState('All')
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  // Load real marketers on mount
  useEffect(() => {
    const accounts = getMarketerAccounts()
    setMarketers(accounts)
  }, [])

  // Refresh periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketers(getMarketerAccounts())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const filtered = marketers.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.username.toLowerCase().includes(search.toLowerCase()) || m.referralCode.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || m.rank === statusFilter // Using rank as status filter
    const matchRank = rankFilter === 'All' || m.rank === rankFilter
    return matchSearch && matchStatus && matchRank
  })

  const selected = marketers.find((m) => m.referralCode === selectedCode)
  const selectedDirect = selected ? getDirectReferrals(selected.referralCode).length : 0

  // Stats from REAL data
  const total = marketers.length
  const active = marketers.filter((m) => m.rank !== 'Starter').length
  const starters = marketers.filter((m) => m.rank === 'Starter').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Marketers', value: String(total), icon: <Users size={18} /> },
          { label: 'Active (Ranked)', value: String(active), icon: <UserCheck size={18} /> },
          { label: 'New (Starter)', value: String(starters), icon: <Award size={18} /> },
          { label: 'Total Earnings', value: `DZD ${(marketers.reduce((s, m) => s + m.earnings, 0) / 1000000).toFixed(1)}M`, icon: <TrendingUp size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#484F58]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold text-lg">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketers List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, username, or referral code..."
                className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
            </div>
            <select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)}
              className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#01D7D5] focus:outline-none">
              {['All', ...RANKS].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                    <th className="text-left py-3 px-3">Name</th>
                    <th className="text-left py-3 px-3">Username</th>
                    <th className="text-left py-3 px-3">Rank</th>
                    <th className="text-left py-3 px-3">Referral Code</th>
                    <th className="text-left py-3 px-3">Direct Referrals</th>
                    <th className="text-left py-3 px-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, idx) => {
                    const directCount = getDirectReferrals(m.referralCode).length
                    return (
                      <tr key={idx} onClick={() => setSelectedCode(m.referralCode)}
                        className={`border-t border-[#30363D]/50 cursor-pointer transition-colors ${selectedCode === m.referralCode ? 'bg-[rgba(1,215,213,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${RANK_COLORS[m.rank]}22`, color: RANK_COLORS[m.rank] }}>
                              {m.name.charAt(0)}
                            </div>
                            <p className="text-white text-sm">{m.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#8B949E] text-xs font-mono">{m.username}</td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${RANK_COLORS[m.rank]}18`, color: RANK_COLORS[m.rank] }}>{m.rank}</span>
                        </td>
                        <td className="py-3 px-3 text-[#01D7D5] text-xs font-mono">{m.referralCode}</td>
                        <td className="py-3 px-3 text-white">{directCount}</td>
                        <td className="py-3 px-3 text-[#484F58] text-xs">{m.joined}</td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-[#484F58]">
                      {marketers.length === 0 ? 'No marketers registered yet' : 'No marketers match your search'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
                  style={{ backgroundColor: `${RANK_COLORS[selected.rank]}22`, color: RANK_COLORS[selected.rank] }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{selected.name}</h4>
                  <p className="text-[#484F58] text-xs">@{selected.username}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${RANK_COLORS[selected.rank]}18`, color: RANK_COLORS[selected.rank] }}>{selected.rank}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Referral Code', value: selected.referralCode, icon: <LinkIcon size={14} /> },
                  { label: 'Direct Referrals', value: `${selectedDirect}`, icon: <Users size={14} /> },
                  { label: 'Earnings', value: `DZD ${selected.earnings.toLocaleString()}`, icon: <TrendingUp size={14} /> },
                  { label: 'Joined', value: selected.joined, icon: <CheckCircle size={14} /> },
                  { label: 'Referred By', value: selected.parentReferralCode || 'None (Founder)', icon: <UserCheck size={14} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#30363D]/50">
                    <span className="flex items-center gap-2 text-[#484F58] text-xs"><span className="text-[#01D7D5]">{item.icon}</span>{item.label}</span>
                    <span className="text-white text-sm font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={32} className="text-[#30363D] mx-auto mb-3" />
              <p className="text-[#484F58] text-sm">Select a marketer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
