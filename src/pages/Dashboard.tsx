import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import {
  LayoutDashboard, ShoppingCart, Users, DollarSign, Trophy, Star, CreditCard,
  BarChart3, Share2, Settings, LogOut, Wallet, Link as LinkIcon,
  Copy, CheckCircle, ArrowUpRight, ArrowDownRight, Gift
} from 'lucide-react'

const mockStats = [
  { labelKey: 'dash.personalSales', value: 'DZD 2,450,000', change: '+12%', icon: <DollarSign size={20} /> },
  { labelKey: 'dash.commissions', value: 'DZD 122,500', change: '+8%', icon: <Wallet size={20} /> },
  { labelKey: 'dash.team', value: 'DZD 45,000', change: '+15%', icon: <Users size={20} /> },
  { labelKey: 'dash.referral', value: '48', change: '+3', icon: <LinkIcon size={20} /> },
]

const mockOrders = [
  { id: 'ER-001', customer: 'Ahmed B.', product: 'E-Ride City Pro', amount: '185,000', status: 'completed', date: '2025-06-01' },
  { id: 'ER-002', customer: 'Yasmine D.', product: 'E-Ride Urban Glide', amount: '125,000', status: 'processing', date: '2025-06-02' },
  { id: 'ER-003', customer: 'Karim H.', product: 'E-Ride Trail Blazer', amount: '259,000', status: 'pending', date: '2025-06-03' },
  { id: 'ER-004', customer: 'Sofia M.', product: 'E-Ride Air Helmet', amount: '8,500', status: 'completed', date: '2025-06-04' },
  { id: 'ER-005', customer: 'Omar K.', product: 'E-Ride Mountain X', amount: '320,000', status: 'shipped', date: '2025-06-05' },
  { id: 'ER-006', customer: 'Nadia B.', product: 'E-Ride Smart Lock', amount: '9,900', status: 'completed', date: '2025-06-05' },
]

const mockTeam = [
  { id: 1, name: 'Omar Khalef', rank: 'Diamond', sales: '5.8M', team: 12, joined: '2023-08-15', status: 'active' },
  { id: 2, name: 'Ahmed Benali', rank: 'Platinum', sales: '4.2M', team: 8, joined: '2023-09-01', status: 'active' },
  { id: 3, name: 'Karim Hadj', rank: 'Gold', sales: '3.1M', team: 5, joined: '2023-10-12', status: 'active' },
  { id: 4, name: 'Yasmine Djebbar', rank: 'Gold', sales: '2.4M', team: 4, joined: '2024-01-05', status: 'active' },
  { id: 5, name: 'Sofia Mansouri', rank: 'Silver', sales: '1.9M', team: 3, joined: '2024-02-20', status: 'frozen' },
  { id: 6, name: 'Farid Taleb', rank: 'Silver', sales: '850K', team: 2, joined: '2024-05-10', status: 'active' },
]

const mockCommissions = [
  { id: 1, source: 'Direct Sale - E-Ride City Pro', amount: '9,250', type: 'direct', date: '2025-06-05', status: 'paid' },
  { id: 2, source: 'Direct Sale - E-Ride Urban Glide', amount: '6,250', type: 'direct', date: '2025-06-04', status: 'paid' },
  { id: 3, source: 'Team Bonus - Omar Khalef', amount: '2,900', type: 'team', date: '2025-06-03', status: 'pending' },
  { id: 4, source: 'Direct Sale - E-Ride Trail Blazer', amount: '12,950', type: 'direct', date: '2025-06-02', status: 'paid' },
  { id: 5, source: 'Team Bonus - Ahmed Benali', amount: '2,100', type: 'team', date: '2025-06-01', status: 'pending' },
  { id: 6, source: 'Direct Sale - E-Ride Air Helmet', amount: '425', type: 'direct', date: '2025-05-31', status: 'paid' },
  { id: 7, source: 'Rank Bonus - Gold', amount: '25,000', type: 'bonus', date: '2025-05-28', status: 'paid' },
]

const RANK_LEVELS = [
  { name: 'Starter', min: 0, color: '#8B949E' },
  { name: 'Silver', min: 500000, color: '#C0C0C0' },
  { name: 'Gold', min: 2000000, color: '#FFD700' },
  { name: 'Platinum', min: 5000000, color: '#E5E4E2' },
  { name: 'Diamond', min: 10000000, color: '#B9F2FF' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  processing: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  shipped: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
  paid: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  active: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  frozen: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
}

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'overview', label: t('dash.overview'), icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: t('admin.orders'), icon: <ShoppingCart size={18} /> },
    { id: 'network', label: t('dash.team'), icon: <Users size={18} /> },
    { id: 'commissions', label: t('dash.commissions'), icon: <DollarSign size={18} /> },
    { id: 'ranks', label: t('admin.ranks'), icon: <Trophy size={18} /> },
    { id: 'loyalty', label: lang === 'ar' ? 'نقاط الولاء' : lang === 'fr' ? 'Points de Fidélité' : 'Loyalty Points', icon: <Star size={18} /> },
    { id: 'subscriptions', label: t('admin.subscriptions'), icon: <CreditCard size={18} /> },
    { id: 'analytics', label: t('admin.analytics'), icon: <BarChart3 size={18} /> },
    { id: 'tools', label: lang === 'ar' ? 'أدوات التسويق' : lang === 'fr' ? 'Outils Marketing' : 'Marketing Tools', icon: <Share2 size={18} /> },
    { id: 'settings', label: t('admin.settings'), icon: <Settings size={18} /> },
  ]

  const referralCode = user?.referralCode || 'DEMO1234'
  const referralLink = `${window.location.origin}/#/register?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {mockStats.map((s) => (
                <div key={s.label || s.labelKey} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58] font-medium">{t(s.labelKey || '') || s.label}</span>
                    <span className="text-[#484F58]">{s.icon}</span>
                  </div>
                  <p className="text-[#01D7D5] font-semibold text-xl mb-1">{s.value}</p>
                  <span className="text-[#01D7D5] text-xs">{s.change}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.salesPerf')}</h3>
                <div className="h-[200px] flex items-end gap-3">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#01D7D5]/20 rounded-t hover:bg-[#01D7D5]/40 transition-colors" style={{ height: `${h * 1.8}px` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {t('dash.months').split(',').map((m) => (
                    <span key={m} className="text-[10px] text-[#484F58]">{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.rank')}</h3>
                <div className="w-16 h-16 rounded-full bg-[rgba(255,215,0,0.15)] flex items-center justify-center mx-auto mb-3">
                  <Trophy size={28} className="text-[#FFD700]" />
                </div>
                <p className="text-[#FFD700] font-semibold text-xl text-center mb-1">Gold</p>
                <div className="w-full bg-[#30363D] rounded-full h-2 mb-2">
                  <div className="bg-[#01D7D5] h-2 rounded-full" style={{ width: '64%' }} />
                </div>
                <p className="text-[#484F58] text-xs text-center">DZD 3.2M / 5M</p>
                <p className="text-[#8B949E] text-xs text-center mt-1">{lang === 'ar' ? 'البلاتين عند 5M دج' : lang === 'fr' ? 'Platine à 5M DZD' : 'Platinum at DZD 5M'}</p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-[#484F58]">{t('dash.personalSales')}</span><span className="text-white">DZD 1.8M</span></div>
                  <div className="flex justify-between"><span className="text-[#484F58]">{t('dash.teamSales')}</span><span className="text-white">DZD 1.4M</span></div>
                  <div className="flex justify-between"><span className="text-[#484F58]">Direct Sales</span><span className="text-white">32</span></div>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">{t('dash.recentOrders')}</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[#01D7D5] text-xs hover:underline">{t('dash.viewAll')}</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                      <th className="text-left py-2 px-2">Order #</th>
                      <th className="text-left py-2 px-2">Customer</th>
                      <th className="text-left py-2 px-2">Product</th>
                      <th className="text-left py-2 px-2">Amount</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.slice(0, 4).map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-2 text-white">{o.id}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.customer}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.product}</td>
                        <td className="py-3 px-2 text-white">{o.amount} DZD</td>
                        <td className="py-3 px-2"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-3">{t('dash.referral')}</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0A0A0A] border border-[#30363D] rounded-lg px-4 py-3 font-mono text-sm text-white truncate">{referralLink}</div>
                <button onClick={handleCopy} className="px-4 py-3 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors flex items-center gap-2">
                  {copied ? <CheckCircle size={16} className="text-[#01D7D5]" /> : <Copy size={16} />}
                  {copied ? t('dash.copied') : t('dash.copy')}
                </button>
              </div>
            </div>
          </div>
        )

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.myOrders')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                      {[t('dash.orderNum'), t('dash.customer'), t('dash.product'), t('dash.amount'), t('dash.status'), t('dash.date')].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white">{o.id}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.customer}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.product}</td>
                        <td className="py-3 px-3 text-white">{o.amount} DZD</td>
                        <td className="py-3 px-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>{o.status}</span></td>
                        <td className="py-3 px-3 text-[#484F58]">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'network':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: lang === 'ar' ? 'إجمالي الفريق' : lang === 'fr' ? 'Équipe Totale' : 'Total Team', value: '24', icon: <Users size={18} /> },
                { label: lang === 'ar' ? 'مباشر' : lang === 'fr' ? 'Directs' : 'Direct', value: '6', icon: <ArrowUpRight size={18} /> },
                { label: lang === 'ar' ? 'غير مباشر' : lang === 'fr' ? 'Indirects' : 'Indirect', value: '18', icon: <ArrowDownRight size={18} /> },
                { label: lang === 'ar' ? 'مبيعات الفريق' : lang === 'fr' ? 'Ventes Équipe' : 'Team Sales', value: 'DZD 8.2M', icon: <DollarSign size={18} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#484F58]">{s.icon}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</span>
                  </div>
                  <p className="text-white font-semibold text-xl">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.myTeam')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                      {[t('dash.member'), t('dash.rank'), t('dash.sales'), t('dash.team'), t('dash.joined'), t('dash.status')].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeam.map((m) => (
                      <tr key={m.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium text-white">{m.name.charAt(0)}</div>
                            <p className="text-white text-sm">{m.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3"><span className="text-[11px] font-medium px-2.5 py-1 rounded-full capitalize" style={{ backgroundColor: `color-mix(in srgb, ${RANK_LEVELS.find(r => r.name === m.rank)?.color || '#8B949E'} 15%, transparent)`, color: RANK_LEVELS.find(r => r.name === m.rank)?.color || '#8B949E' }}>{m.rank}</span></td>
                        <td className="py-3 px-3 text-white">{m.sales}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{m.team}</td>
                        <td className="py-3 px-3 text-[#484F58] text-xs">{m.joined}</td>
                        <td className="py-3 px-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[m.status] || ''}`}>{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Tree View */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.teamStructure')}</h3>
              <div className="flex flex-col items-center">
                {/* You */}
                <div className="bg-[#01D7D5]/10 border border-[#01D7D5]/30 rounded-xl px-6 py-3 text-center">
                  <p className="text-white font-medium text-sm">{lang === 'ar' ? 'أنت (ذهبي)' : lang === 'fr' ? 'Vous (Or)' : 'You (Gold)'}</p>
                  <p className="text-[#8B949E] text-xs">{lang === 'ar' ? 'المستوى 0' : lang === 'fr' ? 'Niveau 0' : 'Level 0'}</p>
                </div>
                <div className="w-px h-8 bg-[#30363D]" />
                {/* Level 1 */}
                <div className="flex gap-8">
                  {['Omar (Diamond)', 'Ahmed (Platinum)', 'Karim (Gold)'].map((name, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-2 text-center">
                        <p className="text-white text-xs">{name}</p>
                      </div>
                      <div className="w-px h-6 bg-[#30363D]" />
                      <div className="flex gap-2">
                        {[1, 2].map((j) => (
                          <div key={j} className="bg-[#0A0A0A] border border-[#30363D] rounded-lg px-2 py-1">
                            <p className="text-[#484F58] text-[10px]">L{j}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'commissions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: lang === 'ar' ? 'إجمالي المكتسب' : lang === 'fr' ? 'Total Gagné' : 'Total Earned', value: 'DZD 122,500', icon: <DollarSign size={18} /> },
                { label: lang === 'ar' ? 'المبيعات المباشرة' : lang === 'fr' ? 'Ventes Directes' : 'Direct Sales', value: 'DZD 89,200', icon: <ArrowUpRight size={18} /> },
                { label: lang === 'ar' ? 'مكافأة الفريق' : lang === 'fr' ? 'Bonus Équipe' : 'Team Bonus', value: 'DZD 28,300', icon: <Users size={18} /> },
                { label: lang === 'ar' ? 'مكافأة الرتبة' : lang === 'fr' ? 'Bonus Rang' : 'Rank Bonus', value: 'DZD 25,000', icon: <Gift size={18} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#484F58]">{s.icon}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.commissionHistory')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                      {[t('dash.source'), t('dash.type'), t('dash.amount'), t('dash.date'), t('dash.status')].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {mockCommissions.map((c) => (
                      <tr key={c.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white text-sm">{c.source}</td>
                        <td className="py-3 px-3"><span className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.type === 'direct' ? 'rgba(1,215,213,0.15)' : c.type === 'team' ? 'rgba(59,130,246,0.15)' : 'rgba(255,215,0,0.15)', color: c.type === 'direct' ? '#01D7D5' : c.type === 'team' ? '#3B82F6' : '#FFD700' }}>{c.type}</span></td>
                        <td className="py-3 px-3 text-[#01D7D5] font-medium">{c.amount} DZD</td>
                        <td className="py-3 px-3 text-[#484F58] text-xs">{c.date}</td>
                        <td className="py-3 px-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[c.status] || ''}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commission Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.commissionBreakdown')}</h3>
                <div className="space-y-3">
                  {[
                    { label: lang === 'ar' ? 'عمولة المبيعات المباشرة (5%)' : lang === 'fr' ? 'Commission Ventes Directes (5%)' : 'Direct Sales Commission (5%)', value: 73, amount: 'DZD 89,200' },
                    { label: lang === 'ar' ? 'تجاوز الفريق (2%)' : lang === 'fr' ? 'Dépassement Équipe (2%)' : 'Team Override (2%)', value: 18, amount: 'DZD 28,300' },
                    { label: lang === 'ar' ? 'مكافآت الرتب' : lang === 'fr' ? 'Bonus de Rang' : 'Rank Bonuses', value: 9, amount: 'DZD 25,000' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8B949E]">{item.label}</span>
                        <span className="text-white">{item.amount}</span>
                      </div>
                      <div className="w-full bg-[#30363D] rounded-full h-2">
                        <div className="bg-[#01D7D5] h-2 rounded-full" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.withdrawal')}</h3>
                <div className="text-center py-6">
                  <p className="text-[#484F58] text-sm mb-2">{t('dash.availableBalance')}</p>
                  <p className="text-[#01D7D5] font-semibold text-3xl mb-4">DZD 42,300</p>
                  <button className="px-8 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
                    {t('dash.requestWithdrawal')}
                  </button>
                  <p className="text-[#484F58] text-xs mt-3">{t('dash.minWithdrawal')}</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ranks':
        return (
          <div className="space-y-6">
            {/* Current Rank */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[rgba(255,215,0,0.15)] flex items-center justify-center mx-auto mb-4">
                <Trophy size={36} className="text-[#FFD700]" />
              </div>
              <h3 className="text-[#FFD700] font-semibold text-2xl mb-1">Gold Rank</h3>
              <p className="text-[#8B949E] text-sm mb-4">64% progress to Platinum</p>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-[#30363D] rounded-full h-3 mb-2">
                  <div className="bg-gradient-to-r from-[#FFD700] to-[#01D7D5] h-3 rounded-full" style={{ width: '64%' }} />
                </div>
                <div className="flex justify-between text-xs text-[#484F58]">
                  <span>DZD 2M (Gold)</span>
                  <span>DZD 3.2M / 5M</span>
                  <span>DZD 5M (Platinum)</span>
                </div>
              </div>
            </div>

            {/* Rank Ladder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {RANK_LEVELS.map((rank, i) => {
                const currentIndex = 2 // Gold
                const isActive = i <= currentIndex
                const isCurrent = i === currentIndex
                return (
                  <div key={rank.name} className={`bg-[#161B22] border rounded-xl p-4 text-center transition-all ${isCurrent ? 'border-[#FFD700]/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : isActive ? 'border-[#30363D]' : 'border-[#30363D]/50 opacity-50'}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${rank.color}20` }}>
                      <Trophy size={18} style={{ color: rank.color }} />
                    </div>
                    <p className="text-white font-medium text-sm">{rank.name}</p>
                    <p className="text-[#484F58] text-xs mt-1">DZD {(rank.min / 1000000).toFixed(1)}M+</p>
                    {isCurrent && <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(255,215,0,0.15)] text-[#FFD700]">{t('dash.current')}</span>}
                  </div>
                )
              })}
            </div>

            {/* Rank Benefits */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.currentBenefits')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: <DollarSign size={18} />, title: lang === 'ar' ? 'عمولة 5%' : lang === 'fr' ? 'Commission 5%' : '5% Commission', desc: lang === 'ar' ? 'على جميع المبيعات المباشرة' : lang === 'fr' ? 'Sur toutes les ventes directes' : 'On all direct sales' },
                  { icon: <Users size={18} />, title: lang === 'ar' ? 'تجاوز فريق 2%' : lang === 'fr' ? 'Dépassement Équipe 2%' : '2% Team Override', desc: lang === 'ar' ? 'على مبيعات أعضاء الفريق' : lang === 'fr' ? 'Sur les ventes des membres' : 'On team member sales' },
                  { icon: <Gift size={18} />, title: 'DZD 25K', desc: lang === 'ar' ? 'مكافأة رتبة لمرة واحدة' : lang === 'fr' ? 'Bonus de rang unique' : 'One-time rank bonus' },
                  { icon: <Star size={18} />, title: lang === 'ar' ? 'دعم أولوية' : lang === 'fr' ? 'Support Prioritaire' : 'Priority Support', desc: lang === 'ar' ? 'قناة دعم مخصصة' : lang === 'fr' ? 'Canal de support dédié' : 'Dedicated support channel' },
                  { icon: <Trophy size={18} />, title: lang === 'ar' ? 'وصول مبكر' : lang === 'fr' ? 'Accès Anticipé' : 'Early Access', desc: lang === 'ar' ? 'معاينات منتجات جديدة' : lang === 'fr' ? 'Aperçus des nouveaux produits' : 'New product previews' },
                  { icon: <Share2 size={18} />, title: lang === 'ar' ? 'إحالة مخصصة' : lang === 'fr' ? 'Parrainage Personnalisé' : 'Custom Referral', desc: lang === 'ar' ? 'رابط إحالة مخصص' : lang === 'fr' ? 'Lien de parrainage personnalisé' : 'Branded referral link' },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-3 p-3 bg-[#0A0A0A] rounded-lg">
                    <div className="text-[#01D7D5]">{b.icon}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{b.title}</p>
                      <p className="text-[#484F58] text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'tools':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-3">{t('dash.referral')}</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0A0A0A] border border-[#30363D] rounded-lg px-4 py-3 font-mono text-sm text-white truncate">{referralLink}</div>
                <button onClick={handleCopy} className="px-4 py-3 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors flex items-center gap-2">
                  {copied ? <CheckCircle size={16} className="text-[#01D7D5]" /> : <Copy size={16} />}
                  {copied ? t('dash.copied') : t('dash.copy')}
                </button>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.socialShare')}</h3>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'WhatsApp', 'Telegram'].map((platform) => (
                  <button key={platform} className="flex-1 py-3 bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg text-sm hover:border-[#01D7D5] transition-colors">{platform}</button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-[#161B22] border border-[#30363D] rounded-xl flex items-center justify-center mb-4">
              <Settings size={28} className="text-[#484F58]" />
            </div>
            <h3 className="text-white font-medium text-lg mb-2">{t('dash.comingSoon')}</h3>
            <p className="text-[#8B949E] text-sm">{t('dash.underDev')}</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="flex">
        <aside className="hidden lg:block w-[260px] min-h-[calc(100vh-70px)] bg-[#0A0A0A] border-r border-[#30363D] fixed top-[70px] left-0 bottom-0 overflow-y-auto">
          <Link to="/" className="block px-6 py-5 text-[#01D7D5] font-semibold text-base tracking-[0.05em]">E-RIDE</Link>
          <nav className="px-3 pb-4">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors mb-0.5 ${activeTab === item.id ? 'bg-[rgba(1,215,213,0.1)] text-[#01D7D5]' : 'text-[#8B949E] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-6 mt-auto">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">{user?.name?.charAt(0) || 'U'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-[#8B949E] text-[11px]">{t('dash.goldMarketer')}</p>
                </div>
              </div>
              <button onClick={logout} className="w-full mt-3 flex items-center gap-2 text-[#EF4444] text-sm hover:underline"><LogOut size={14} /> Logout</button>
            </div>
          </div>
        </aside>

        <div className="flex-1 lg:ml-[260px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-semibold text-xl capitalize">{navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}</h1>
            <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">{user?.name?.charAt(0) || 'U'}</div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
