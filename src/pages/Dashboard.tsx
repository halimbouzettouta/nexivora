import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, ShoppingCart, Users, DollarSign, Trophy, Star, CreditCard,
  BarChart3, Share2, Settings, LogOut, Wallet, Link as LinkIcon,
  Copy, CheckCircle
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { id: 'network', label: 'My Network', icon: <Users size={18} /> },
  { id: 'commissions', label: 'Commissions', icon: <DollarSign size={18} /> },
  { id: 'ranks', label: 'Ranks & Rewards', icon: <Trophy size={18} /> },
  { id: 'loyalty', label: 'Loyalty Points', icon: <Star size={18} /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { id: 'tools', label: 'Marketing Tools', icon: <Share2 size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
]

const mockStats = [
  { label: 'Total Sales', value: 'DZD 2,450,000', change: '+12%', icon: <DollarSign size={20} /> },
  { label: 'Direct Commission', value: 'DZD 122,500', change: '+8%', icon: <Wallet size={20} /> },
  { label: 'Team Bonus', value: 'DZD 45,000', change: '+15%', icon: <Users size={20} /> },
  { label: 'Active Referrals', value: '48', change: '+3 this week', icon: <LinkIcon size={20} /> },
]

const mockRecentOrders = [
  { id: 'ER-001', customer: 'Ahmed B.', product: 'E-Ride City Pro', amount: '185,000', status: 'completed', date: '2025-06-01' },
  { id: 'ER-002', customer: 'Yasmine D.', product: 'E-Ride Urban Glide', amount: '125,000', status: 'processing', date: '2025-06-02' },
  { id: 'ER-003', customer: 'Karim H.', product: 'E-Ride Trail Blazer', amount: '259,000', status: 'pending', date: '2025-06-03' },
  { id: 'ER-004', customer: 'Sofia M.', product: 'E-Ride Air Helmet', amount: '8,500', status: 'completed', date: '2025-06-04' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  processing: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
}

export default function Dashboard() {
  const { tab } = useParams<{ tab: string }>()
  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [copied, setCopied] = useState(false)
  const { user, logout } = useAuth()

  const referralLink = `https://eride-dz.com/ref/${user?.id || 'ABCD1234'}`

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
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {mockStats.map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58] font-medium">{s.label}</span>
                    <span className="text-[#484F58]">{s.icon}</span>
                  </div>
                  <p className="text-[#01D7D5] font-semibold text-xl mb-1">{s.value}</p>
                  <span className="text-[#01D7D5] text-xs">{s.change}</span>
                </div>
              ))}
            </div>

            {/* Rank Progress + Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">Sales Performance</h3>
                <div className="h-[200px] flex items-end gap-3">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-[#01D7D5]/20 rounded-t hover:bg-[#01D7D5]/40 transition-colors"
                        style={{ height: `${h * 1.8}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <span key={m} className="text-[10px] text-[#484F58]">{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">Current Rank</h3>
                <div className="w-16 h-16 rounded-full bg-[rgba(255,215,0,0.15)] flex items-center justify-center mx-auto mb-3">
                  <Trophy size={28} className="text-[#FFD700]" />
                </div>
                <p className="text-[#FFD700] font-semibold text-xl text-center mb-1">Gold</p>
                <div className="w-full bg-[#30363D] rounded-full h-2 mb-2">
                  <div className="bg-[#01D7D5] h-2 rounded-full" style={{ width: '64%' }} />
                </div>
                <p className="text-[#484F58] text-xs text-center">DZD 3.2M / 5M</p>
                <p className="text-[#8B949E] text-xs text-center mt-1">Platinum at DZD 5M</p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-[#484F58]">Personal Sales</span><span className="text-white">DZD 1.8M</span></div>
                  <div className="flex justify-between"><span className="text-[#484F58]">Team Sales</span><span className="text-white">DZD 1.4M</span></div>
                  <div className="flex justify-between"><span className="text-[#484F58]">Direct Sales</span><span className="text-white">32</span></div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[#01D7D5] text-xs hover:underline">
                  View All
                </button>
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
                      <th className="text-left py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-2 text-white">{o.id}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.customer}</td>
                        <td className="py-3 px-2 text-[#8B949E]">{o.product}</td>
                        <td className="py-3 px-2 text-white">{o.amount} DZD</td>
                        <td className="py-3 px-2">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[#484F58]">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-3">Your Referral Link</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0A0A0A] border border-[#30363D] rounded-lg px-4 py-3 font-mono text-sm text-white truncate">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors flex items-center gap-2"
                >
                  {copied ? <CheckCircle size={16} className="text-[#01D7D5]" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )

      case 'tools':
        return (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-3">Your Referral Link</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0A0A0A] border border-[#30363D] rounded-lg px-4 py-3 font-mono text-sm text-white truncate">
                  {referralLink}
                </div>
                <button onClick={handleCopy} className="px-4 py-3 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors flex items-center gap-2">
                  {copied ? <CheckCircle size={16} className="text-[#01D7D5]" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">Social Share</h3>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'WhatsApp', 'Telegram'].map((platform) => (
                  <button key={platform} className="flex-1 py-3 bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg text-sm hover:border-[#01D7D5] transition-colors">
                    {platform}
                  </button>
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
            <h3 className="text-white font-medium text-lg mb-2">Coming Soon</h3>
            <p className="text-[#8B949E] text-sm">This section is under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] min-h-[calc(100vh-70px)] bg-[#0A0A0A] border-r border-[#30363D] fixed top-[70px] left-0 bottom-0 overflow-y-auto">
          <Link to="/" className="block px-6 py-5 text-[#01D7D5] font-semibold text-base tracking-[0.05em]">
            E-RIDE
          </Link>
          <nav className="px-3 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors mb-0.5 ${
                  activeTab === item.id
                    ? 'bg-[rgba(1,215,213,0.1)] text-[#01D7D5]'
                    : 'text-[#8B949E] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-6 mt-auto">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-[#8B949E] text-[11px]">Gold Marketer</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full mt-3 flex items-center gap-2 text-[#EF4444] text-sm hover:underline"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 lg:ml-[260px] p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-semibold text-xl capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
