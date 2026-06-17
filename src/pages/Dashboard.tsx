import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useLanguage } from '@/hooks/useLanguage'
import { getMarketerSession, clearMarketerSession, getDirectReferrals, getFullDownline, getNetworkStats, updateMarketerPassword, verifyMarketerLogin } from '@/hooks/marketerAuth'
import { getOrders, getCommissionsForMarketer, getCommissionStatsForMarketer } from '@/hooks/orderStore'
import {
  LayoutDashboard, ShoppingCart, Users, DollarSign, Trophy, Star, CreditCard,
  BarChart3, Share2, Settings, LogOut, Wallet, Link as LinkIcon,
  Copy, CheckCircle, ArrowUpRight, ArrowDownRight, User, Lock,
  MessageCircle, Facebook, Twitter, Instagram, Mail, Send, Zap, Target, TrendingUp, Award, Crown, Diamond, ChevronRight, Lightbulb, Smartphone, Download, Gift
} from 'lucide-react'

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const marketer = getMarketerSession()

  const handleLogout = () => {
    clearMarketerSession()
    navigate('/login')
  }

  const navItems = [
    { id: 'overview', label: t('dash.overview'), icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: t('admin.orders'), icon: <ShoppingCart size={18} /> },
    { id: 'network', label: t('dash.team'), icon: <Users size={18} /> },
    { id: 'commissions', label: t('dash.commissions'), icon: <DollarSign size={18} /> },
    { id: 'ranks', label: t('admin.ranks'), icon: <Trophy size={18} /> },
    { id: 'subscriptions', label: t('admin.subscriptions'), icon: <CreditCard size={18} /> },
    { id: 'analytics', label: t('admin.analytics'), icon: <BarChart3 size={18} /> },
    { id: 'tools', label: lang === 'ar' ? 'أدوات التسويق' : lang === 'fr' ? 'Outils Marketing' : 'Marketing Tools', icon: <Share2 size={18} /> },
    { id: 'profile', label: lang === 'ar' ? 'الملف الشخصي' : lang === 'fr' ? 'Profil' : 'My Profile', icon: <User size={18} /> },
  ]

  const referralCode = marketer?.referralCode || ''
  const referralLink = `${window.location.origin}/#/register?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get this marketer's personal data only
  // Match orders by: referral code, OR customer name matching marketer's name
  const allOrders = getOrders()
  const myOrders = referralCode
    ? allOrders.filter(o =>
        o.marketerReferralCode === referralCode ||
        o.customerName === marketer?.name
      )
    : allOrders.filter(o => o.customerName === marketer?.name)
  const myCommissions = referralCode ? getCommissionsForMarketer(referralCode) : []
  const myCommStats = referralCode ? getCommissionStatsForMarketer(referralCode) : { totalEarned: 0, totalPending: 0, directTotal: 0, teamTotal: 0, bonusTotal: 0, count: 0 }

  // Import verifyMarketerLogin from the same module
  const handlePasswordChange = () => {
    if (!oldPwd || !newPwd) {
      setPwdMsg(lang === 'ar' ? 'جميع الحقول مطلوبة' : lang === 'fr' ? 'Tous les champs sont requis' : 'All fields are required')
      return
    }
    if (newPwd.length < 6) {
      setPwdMsg(lang === 'ar' ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' : lang === 'fr' ? 'Le nouveau mot de passe doit contenir au moins 6 caractères' : 'New password must be at least 6 characters')
      return
    }
    // Verify old password
    const validOld = verifyMarketerLogin(marketer?.username || '', oldPwd)
    if (!validOld) {
      setPwdMsg(lang === 'ar' ? 'كلمة المرور القديمة خاطئة' : lang === 'fr' ? 'Ancien mot de passe incorrect' : 'Old password is incorrect')
      return
    }
    // Update password using the correct function
    const success = updateMarketerPassword(marketer?.username || '', newPwd)
    if (success) {
      setPwdMsg(lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : lang === 'fr' ? 'Mot de passe mis à jour avec succès' : 'Password updated successfully')
      setOldPwd('')
      setNewPwd('')
    } else {
      setPwdMsg(lang === 'ar' ? 'حدث خطأ' : lang === 'fr' ? 'Une erreur s\'est produite' : 'An error occurred')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: t('dash.personalSales'), value: `DZD ${myOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, change: `${myOrders.length} orders`, icon: <DollarSign size={20} /> },
                { label: t('dash.commissions'), value: `DZD ${myCommStats.totalEarned.toLocaleString()}`, change: `${myCommStats.count} txs`, icon: <Wallet size={20} /> },
                { label: t('dash.team'), value: `${getDirectReferrals(referralCode).length}`, change: 'direct refs', icon: <Users size={20} /> },
                { label: t('dash.referral'), value: referralCode, change: 'your code', icon: <LinkIcon size={20} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58] font-medium">{s.label}</span>
                    <span className="text-[#484F58]">{s.icon}</span>
                  </div>
                  <p className="text-[#01D7D5] font-semibold text-xl mb-1 truncate">{s.value}</p>
                  <span className="text-[#01D7D5] text-xs">{s.change}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.salesPerf')}</h3>
                <div className="h-[200px] flex items-end gap-3">
                  {[28, 42, 35, 55, 48, 72, 65, 78, 60, 75, 85, myOrders.length > 0 ? Math.min(95, myOrders.length * 15) : 10].map((h, i) => (
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
                <p className="text-[#FFD700] font-semibold text-xl text-center mb-1">{marketer?.rank || 'Starter'}</p>
                <div className="w-full bg-[#30363D] rounded-full h-2 mb-2">
                  <div className="bg-[#01D7D5] h-2 rounded-full" style={{ width: `${Math.min(100, (myCommStats.totalEarned / 5000000) * 100)}%` }} />
                </div>
                <p className="text-[#484F58] text-xs text-center">DZD {myCommStats.totalEarned.toLocaleString()} / 5M</p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-[#484F58]">{t('dash.personalSales')}</span><span className="text-white">DZD {myOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[#484F58]">{t('dash.commissions')}</span><span className="text-white">DZD {myCommStats.totalEarned.toLocaleString()}</span></div>
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
                    {myOrders.length === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-[#484F58]">No orders yet. Your orders will appear here when customers buy through your link.</td></tr>
                    )}
                    {myOrders.slice(0, 4).map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-2 text-white font-mono text-xs">{o.orderNumber}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.customerName}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.items.map(i => i.name).join(', ').slice(0, 30)}</td>
                        <td className="py-3 px-2 text-white">{o.total.toLocaleString()} DZD</td>
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
            {/* Debug info */}
            <div className="bg-[#0A0A0A] border border-[#30363D]/50 rounded-lg p-3">
              <p className="text-[#484F58] text-xs">Logged in as: <span className="text-[#8B949E]">{marketer?.name}</span> | Referral Code: <span className="text-[#01D7D5] font-mono">{referralCode || 'none'}</span> | Total orders in system: <span className="text-[#8B949E]">{allOrders.length}</span></p>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">{t('dash.myOrders')} ({myOrders.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                      {[t('dash.orderNum'), 'Customer', 'Products', t('dash.amount'), t('dash.status'), t('dash.date')].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.length === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-[#484F58]">No orders yet. Share your referral link to start getting sales!</td></tr>
                    )}
                    {myOrders.map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white font-mono text-xs">{o.orderNumber}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.customerName}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.items.map(i => i.name).join(', ').slice(0, 40)}</td>
                        <td className="py-3 px-3 text-white">{o.total.toLocaleString()} DZD</td>
                        <td className="py-3 px-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>{o.status}</span></td>
                        <td className="py-3 px-3 text-[#484F58]">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'network': {
        const direct = getDirectReferrals(referralCode)
        const downline = getFullDownline(referralCode)
        const stats = getNetworkStats(referralCode)
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: lang === 'ar' ? 'إجمالي الفريق' : lang === 'fr' ? 'Équipe Totale' : 'Total Team', value: String(stats.totalTeam), icon: <Users size={18} /> },
                { label: lang === 'ar' ? 'مباشر' : lang === 'fr' ? 'Directs' : 'Direct', value: String(stats.directCount), icon: <ArrowUpRight size={18} /> },
                { label: lang === 'ar' ? 'غير مباشر' : lang === 'fr' ? 'Indirects' : 'Indirect', value: String(stats.indirectCount), icon: <ArrowDownRight size={18} /> },
                { label: lang === 'ar' ? 'مبيعات الفريق' : lang === 'fr' ? 'Ventes Équipe' : 'Team Sales', value: `DZD ${(stats.teamSales / 1000000).toFixed(1)}M`, icon: <DollarSign size={18} /> },
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
              <h3 className="text-white font-medium mb-4">{t('dash.myTeam')} ({direct.length})</h3>
              {direct.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={40} className="text-[#30363D] mx-auto mb-3" />
                  <p className="text-[#484F58] text-sm">No direct referrals yet.</p>
                  <p className="text-[#484F58] text-xs mt-1">Share your referral link to start building your team!</p>
                  <button onClick={() => setActiveTab('tools')} className="mt-3 text-[#01D7D5] text-xs hover:underline">Go to Marketing Tools &rarr;</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {direct.map((m, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#30363D] flex items-center justify-center text-white font-medium">{m.name.charAt(0)}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <p className="text-[#484F58] text-xs">{m.rank} &middot; {m.referralCode}</p>
                        <p className="text-[#8B949E] text-[10px]">Joined {m.joinedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {downline.length > 0 && (
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{t('dash.teamStructure')}</h3>
                <div className="space-y-2">
                  {downline.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#30363D]/30">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.level === 1 ? '#01D7D5' : d.level === 2 ? '#3B82F6' : '#8B5CF6' }} />
                      <span className="text-[#484F58] text-xs w-16">Level {d.level}</span>
                      <span className="text-white text-sm">{d.account.name}</span>
                      <span className="text-[#484F58] text-xs ml-auto">{d.account.rank}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }

      case 'commissions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Earned', value: `DZD ${myCommStats.totalEarned.toLocaleString()}`, icon: <DollarSign size={18} /> },
                { label: 'Direct Sales', value: `DZD ${myCommStats.directTotal.toLocaleString()}`, icon: <ArrowUpRight size={18} /> },
                { label: 'Team Bonus', value: `DZD ${myCommStats.teamTotal.toLocaleString()}`, icon: <Users size={18} /> },
                { label: 'Rank Bonus', value: `DZD ${myCommStats.bonusTotal.toLocaleString()}`, icon: <Trophy size={18} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#484F58] mb-1">{s.label}</p>
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
                      {['Source', 'Type', 'Amount', 'Date', 'Status'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {myCommissions.length === 0 && (
                      <tr><td colSpan={5} className="py-8 text-center text-[#484F58]">No commissions yet. When someone buys through your referral link, you earn 5% commission!</td></tr>
                    )}
                    {myCommissions.map((c) => (
                      <tr key={c.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white text-sm">{c.source}</td>
                        <td className="py-3 px-3"><span className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.type === 'direct' ? 'rgba(1,215,213,0.15)' : c.type === 'team' ? 'rgba(59,130,246,0.15)' : 'rgba(255,215,0,0.15)', color: c.type === 'direct' ? '#01D7D5' : c.type === 'team' ? '#3B82F6' : '#FFD700' }}>{c.type}</span></td>
                        <td className="py-3 px-3 text-[#01D7D5] font-medium">{c.amount.toLocaleString()} DZD</td>
                        <td className="py-3 px-3 text-[#484F58] text-xs">{c.date}</td>
                        <td className="py-3 px-3"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[c.status] || ''}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="max-w-[600px] space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center text-[#01D7D5] text-2xl font-semibold">
                  {marketer?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl">{marketer?.name || 'User'}</h3>
                  <p className="text-[#484F58] text-sm">@{marketer?.username}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(255,215,0,0.15)] text-[#FFD700]">{marketer?.rank || 'Starter'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0A0A0A] rounded-lg p-3">
                  <p className="text-[#484F58] text-xs">Referral Code</p>
                  <p className="text-[#01D7D5] font-mono text-sm">{marketer?.referralCode}</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-3">
                  <p className="text-[#484F58] text-xs">Earnings</p>
                  <p className="text-white font-medium text-sm">DZD {myCommStats.totalEarned.toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-3">
                  <p className="text-[#484F58] text-xs">Direct Referrals</p>
                  <p className="text-white font-medium text-sm">{getDirectReferrals(referralCode).length}</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-3">
                  <p className="text-[#484F58] text-xs">Orders</p>
                  <p className="text-white font-medium text-sm">{myOrders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} className="text-[#01D7D5]" />
                <h3 className="text-white font-medium">{lang === 'ar' ? 'تغيير كلمة المرور' : lang === 'fr' ? 'Changer le Mot de Passe' : 'Change Password'}</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="password"
                  value={oldPwd}
                  onChange={(e) => { setOldPwd(e.target.value); setPwdMsg('') }}
                  placeholder={lang === 'ar' ? 'كلمة المرور القديمة' : lang === 'fr' ? 'Ancien mot de passe' : 'Current password'}
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => { setNewPwd(e.target.value); setPwdMsg('') }}
                  placeholder={lang === 'ar' ? 'كلمة المرور الجديدة' : lang === 'fr' ? 'Nouveau mot de passe' : 'New password (min 6 chars)'}
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none text-sm"
                />
                <button
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all text-sm"
                >
                  {lang === 'ar' ? 'تحديث كلمة المرور' : lang === 'fr' ? 'Mettre à Jour' : 'Update Password'}
                </button>
                {pwdMsg && <p className={`text-xs ${pwdMsg.includes('success') || pwdMsg.includes('تم') || pwdMsg.includes('succès') ? 'text-[#01D7D5]' : 'text-[#EF4444]'}`}>{pwdMsg}</p>}
              </div>
            </div>
          </div>
        )

      case 'tools':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Share2 size={18} className="text-[#01D7D5]" /> Share Your Referral Link</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-[#0A0A0A] border border-[#30363D] rounded-lg px-4 py-3 font-mono text-sm text-white truncate">{referralLink}</div>
                <button onClick={handleCopy} className="px-4 py-3 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors">
                  {copied ? <CheckCircle size={16} className="text-[#01D7D5]" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'WhatsApp', icon: <MessageCircle size={18} />, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent('Join Nexivora Algeria! ' + referralLink)}` },
                  { name: 'Facebook', icon: <Facebook size={18} />, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
                  { name: 'Instagram', icon: <Instagram size={18} />, color: '#E4405F', url: '#' },
                  { name: 'Email', icon: <Mail size={18} />, color: '#EA4335', url: `mailto:?subject=Join Nexivora&body=${encodeURIComponent('Join Nexivora: ' + referralLink)}` },
                ].map((platform) => (
                  <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white border border-[#30363D] hover:border-[#01D7D5] transition-colors"
                    style={{ backgroundColor: `${platform.color}15` }}>
                    <span style={{ color: platform.color }}>{platform.icon}</span>
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Smartphone size={18} className="text-[#01D7D5]" /> Your QR Code</h3>
              <div className="flex items-center gap-6">
                <div className="bg-white rounded-xl p-3 w-[160px] h-[160px] flex items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}`} alt="QR Code" className="w-[140px] h-[140px]" />
                </div>
                <div>
                  <p className="text-[#8B949E] text-sm mb-2">Scan this code to join your network</p>
                  <p className="text-[#484F58] text-xs mb-3">Download and print for physical marketing</p>
                  <a href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}`} download="nexivora-qr.png"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#01D7D5] text-black text-sm font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
                    <Download size={14} /> Download QR
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Send size={18} className="text-[#01D7D5]" /> Ready-to-Use Messages</h3>
              <div className="space-y-3">
                {[
                  `Join me at Nexivora Algeria! Earn commissions on every electric bike sale. Sign up: ${referralLink}`,
                  `Looking for a side income? I'm part of Nexivora's marketer program. Earn commissions selling e-bikes. Join: ${referralLink}`,
                  `I just joined Nexivora! You can too. Become a marketer and start earning: ${referralLink}`,
                ].map((msg, i) => (
                  <div key={i} className="bg-[#0A0A0A] rounded-lg p-3 flex items-start gap-3">
                    <p className="text-[#8B949E] text-sm flex-1">{msg}</p>
                    <button onClick={() => { navigator.clipboard.writeText(msg); alert('Copied!') }}
                      className="px-3 py-1.5 bg-[#30363D] text-white text-xs rounded hover:bg-[#484F58] transition-colors shrink-0">Copy</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'analytics': {
        const directCount = getDirectReferrals(referralCode).length
        const fullTeam = getFullDownline(referralCode)
        const nextRank = RANK_LEVELS.find(r => r.min > myCommStats.totalEarned) || RANK_LEVELS[RANK_LEVELS.length - 1]
        const prevRank = RANK_LEVELS.filter(r => r.min <= myCommStats.totalEarned).pop() || RANK_LEVELS[0]
        const progress = nextRank ? Math.min(100, ((myCommStats.totalEarned - prevRank.min) / (nextRank.min - prevRank.min)) * 100) : 100
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Conversion Rate', value: myOrders.length > 0 ? `${Math.min(100, myOrders.length * 10)}%` : '0%', sub: 'est. clicks to sales', icon: <Target size={18} /> },
                { label: 'Team Growth', value: `+${directCount}`, sub: 'direct this period', icon: <TrendingUp size={18} /> },
                { label: 'Avg Commission', value: myCommStats.count > 0 ? `DZD ${Math.round(myCommStats.totalEarned / myCommStats.count)}` : 'DZD 0', sub: 'per transaction', icon: <DollarSign size={18} /> },
                { label: 'Team Depth', value: `${fullTeam.length > 0 ? Math.max(...fullTeam.map(d => d.level)) : 0}`, sub: 'max levels', icon: <BarChart3 size={18} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                  <div className="text-[#484F58] mb-2">{s.icon}</div>
                  <p className="text-white font-semibold text-lg">{s.value}</p>
                  <p className="text-[#484F58] text-xs">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Award size={18} className="text-[#FFD700]" /> Rank Progression</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-white font-semibold" style={{ color: prevRank.color }}>{prevRank.name}</p>
                  <p className="text-[#484F58] text-xs">DZD {prevRank.min.toLocaleString()}</p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-[#30363D] rounded-full h-3">
                    <div className="h-3 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: prevRank.color }} />
                  </div>
                  <p className="text-center text-[#8B949E] text-xs mt-1">DZD {myCommStats.totalEarned.toLocaleString()} / DZD {nextRank.min.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold" style={{ color: nextRank.color }}>{nextRank.name}</p>
                  <p className="text-[#484F58] text-xs">DZD {nextRank.min.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-[#F59E0B]" /> AI-Powered Tips</h3>
              <div className="space-y-3">
                {[
                  directCount === 0 && { text: 'You have no referrals yet. Share your link on WhatsApp groups to get your first team member!', action: 'Share Now' },
                  directCount > 0 && myOrders.length === 0 && { text: `Great! You have ${directCount} team members. Share product links to start earning commissions.`, action: 'View Products' },
                  myOrders.length > 0 && { text: `You're doing well with ${myOrders.length} orders! Focus on recruiting more team members to unlock team bonuses.`, action: 'Recruit' },
                  progress < 30 && { text: `You're ${Math.round(100 - progress)}% away from ${nextRank.name} rank. Keep promoting!`, action: 'View Ranks' },
                ].filter(Boolean).map((tip: any, i) => (
                  <div key={i} className="bg-[#0A0A0A] border border-[#30363D] rounded-lg p-4 flex items-start gap-3">
                    <Zap size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#8B949E] text-sm">{tip.text}</p>
                      <button onClick={() => setActiveTab(tip.action === 'Share Now' || tip.action === 'Recruit' ? 'tools' : tip.action === 'View Products' ? 'overview' : 'ranks')}
                        className="text-[#01D7D5] text-xs mt-1 hover:underline">{tip.action} &rarr;</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      case 'ranks':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-6">Rank System</h3>
              <div className="space-y-4">
                {RANK_LEVELS.map((rank, i) => {
                  const isCurrent = rank.name === (marketer?.rank || 'Starter')
                  const isUnlocked = myCommStats.totalEarned >= rank.min
                  return (
                    <div key={rank.name} className={`flex items-center gap-4 p-4 rounded-xl border ${isCurrent ? 'border-[#01D7D5] bg-[rgba(1,215,213,0.05)]' : isUnlocked ? 'border-[#30363D]' : 'border-[#30363D]/30 opacity-50'}`}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${rank.color}22` }}>
                        {i === 0 ? <Star size={20} style={{ color: rank.color }} /> : i === 1 ? <Award size={20} style={{ color: rank.color }} /> : i === 2 ? <Trophy size={20} style={{ color: rank.color }} /> : i === 3 ? <Crown size={20} style={{ color: rank.color }} /> : <Diamond size={20} style={{ color: rank.color }} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{rank.name}</h4>
                          {isCurrent && <span className="text-[10px] bg-[#01D7D5] text-black px-2 py-0.5 rounded-full font-medium">CURRENT</span>}
                          {isUnlocked && !isCurrent && <span className="text-[10px] bg-[rgba(1,215,213,0.15)] text-[#01D7D5] px-2 py-0.5 rounded-full">UNLOCKED</span>}
                        </div>
                        <p className="text-[#484F58] text-xs">Min: DZD {rank.min.toLocaleString()}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#484F58]" />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Current Benefits ({marketer?.rank || 'Starter'})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <DollarSign size={16} />, title: '5% Commission', desc: 'On all direct sales' },
                  { icon: <Users size={16} />, title: '2% Team Override', desc: 'On team member sales' },
                  { icon: <Gift size={16} />, title: 'DZD 25K Bonus', desc: 'One-time rank bonus' },
                  { icon: <Star size={16} />, title: 'Priority Support', desc: 'Dedicated support channel' },
                  { icon: <Trophy size={16} />, title: 'Early Access', desc: 'New product previews' },
                  { icon: <Share2 size={16} />, title: 'Custom Referral', desc: 'Branded referral link' },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#0A0A0A] rounded-lg p-3">
                    <div className="text-[#01D7D5]">{b.icon}</div>
                    <div>
                      <p className="text-white text-sm">{b.title}</p>
                      <p className="text-[#484F58] text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 text-center">
              <CreditCard size={48} className="text-[#01D7D5] mx-auto mb-4" />
              <h3 className="text-white font-semibold text-xl mb-2">Maintenance Plans</h3>
              <p className="text-[#8B949E] max-w-[400px] mx-auto mb-6">Subscribe to a maintenance plan to keep your vehicle in perfect condition.</p>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
                Browse Plans
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Basic', price: '2,500', period: 'month', features: ['Monthly inspection', '10% parts discount', 'Priority scheduling'] },
                { name: 'Premium', price: '5,000', period: 'month', features: ['Weekly check-ups', '24/7 emergency support', '20% parts discount', 'Free pick-up & delivery'], rec: true },
                { name: 'Warranty+', price: '15,000', period: 'year', features: ['Extended warranty', 'Annual deep service', 'Free labor on repairs', 'Replacement guarantee'] },
              ].map((plan) => (
                <div key={plan.name} className={`bg-[#161B22] rounded-xl p-6 ${plan.rec ? 'border border-[#01D7D5]' : 'border border-[#30363D]'}`}>
                  {plan.rec && <span className="inline-block bg-[#01D7D5] text-black text-[10px] font-bold px-2 py-0.5 rounded mb-3">RECOMMENDED</span>}
                  <h4 className="text-white font-medium text-lg">{plan.name}</h4>
                  <p className="text-[#01D7D5] font-semibold text-2xl mb-4">{plan.price} <span className="text-sm text-[#8B949E]">DZD/{plan.period}</span></p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]"><CheckCircle size={14} className="text-[#01D7D5]" />{f}</li>
                    ))}
                  </ul>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${plan.rec ? 'bg-[#01D7D5] text-black' : 'border border-[#30363D] text-white hover:border-[#01D7D5]'}`}>Subscribe</button>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#484F58]">Coming soon</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-[240px] flex-shrink-0">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 sticky top-[90px]">
              <div className="mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(1,215,213,0.15)] flex items-center justify-center text-[#01D7D5] font-semibold text-sm">
                    {marketer?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium truncate">{marketer?.name || 'User'}</p>
                    <p className="text-[#484F58] text-xs">{marketer?.rank || 'Starter'} Marketer</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-[rgba(1,215,213,0.1)] text-[#01D7D5]'
                        : 'text-[#8B949E] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>

              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-[#EF4444] text-sm hover:bg-[rgba(239,68,68,0.05)] transition-colors rounded-lg mt-4 border-t border-[#30363D] pt-4">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-2xl mb-6">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
