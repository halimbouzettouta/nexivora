import { useState } from 'react'
import { Link } from 'react-router'
import {
  LayoutDashboard, TrendingUp, ShoppingCart, Users, GitBranch, DollarSign, Trophy,
  Package, UserCircle, CreditCard, MapPin, FileText, Bell, Settings, ClipboardList,
  Brain, LogOut, ArrowUpRight, ArrowDownRight, AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const adminNavItems = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { id: 'marketers', label: 'Marketers', icon: <Users size={18} /> },
  { id: 'network', label: 'Network Tree', icon: <GitBranch size={18} /> },
  { id: 'commissions', label: 'Commissions', icon: <DollarSign size={18} /> },
  { id: 'ranks', label: 'Ranks & Rewards', icon: <Trophy size={18} /> },
  { id: 'products', label: 'Products', icon: <Package size={18} /> },
  { id: 'customers', label: 'Customers', icon: <UserCircle size={18} /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} /> },
  { id: 'dealers', label: 'Dealers', icon: <MapPin size={18} /> },
  { id: 'content', label: 'Content', icon: <FileText size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'analytics', label: 'Analytics & AI', icon: <Brain size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={18} /> },
]

const kpiCards = [
  { label: 'Total Revenue', value: 'DZD 12.5M', change: '+18%', positive: true, icon: <TrendingUp size={20} /> },
  { label: 'Total Orders', value: '342', change: '+24', positive: true, icon: <ShoppingCart size={20} /> },
  { label: 'Active Marketers', value: '156', change: '+12', positive: true, icon: <Users size={20} /> },
  { label: 'Pending Commissions', value: 'DZD 245K', change: '0', positive: true, icon: <DollarSign size={20} /> },
  { label: 'Low Stock Alerts', value: '3', change: 'urgent', positive: false, icon: <AlertTriangle size={20} /> },
]

const recentOrders = [
  { id: 'ER-1289', customer: 'Ahmed Benali', product: 'E-Ride City Pro', amount: '185,000', status: 'completed', date: '2025-06-05' },
  { id: 'ER-1288', customer: 'Yasmine D.', product: 'E-Ride Urban Glide', amount: '125,000', status: 'processing', date: '2025-06-05' },
  { id: 'ER-1287', customer: 'Karim Hadj', product: 'E-Ride Trail Blazer', amount: '259,000', status: 'shipped', date: '2025-06-04' },
  { id: 'ER-1286', customer: 'Sofia Mansouri', product: 'E-Ride Mountain X', amount: '320,000', status: 'completed', date: '2025-06-04' },
  { id: 'ER-1285', customer: 'Omar Khalef', product: 'E-Ride Air Helmet', amount: '8,500', status: 'pending', date: '2025-06-03' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  processing: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  shipped: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
  canceled: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
}

const topMarketers = [
  { name: 'Ahmed Benali', rank: 'Diamond', sales: '4.2M', commission: '210K', team: 45 },
  { name: 'Karim Hadj', rank: 'Platinum', sales: '3.1M', commission: '155K', team: 32 },
  { name: 'Yasmine Djebbar', rank: 'Gold', sales: '2.4M', commission: '120K', team: 28 },
  { name: 'Omar Khalef', rank: 'Diamond', sales: '5.8M', commission: '290K', team: 67 },
  { name: 'Sofia Mansouri', rank: 'Gold', sales: '1.9M', commission: '95K', team: 21 },
]

const aiInsights = [
  { text: 'Product "E-Ride City Pro" is trending up 34% — consider increasing stock', type: 'trend' },
  { text: 'Marketer Ahmed B. has 0 sales this week — may need support', type: 'alert' },
  { text: 'Weekend conversion rate is 23% higher — schedule campaigns accordingly', type: 'insight' },
  { text: '3 accounts show suspicious activity pattern — review recommended', type: 'warning' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { logout } = useAuth()

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#484F58] font-medium">{kpi.label}</span>
                    <span className="text-[#484F58]">{kpi.icon}</span>
                  </div>
                  <p className="text-white font-semibold text-xl mb-1">{kpi.value}</p>
                  <span className={`text-xs flex items-center gap-1 ${kpi.positive ? 'text-[#01D7D5]' : 'text-[#EF4444]'}`}>
                    {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">Revenue Trends</h3>
                <div className="h-[220px] flex items-end gap-2">
                  {[30, 45, 35, 60, 50, 75, 65, 80, 55, 70, 85, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-[#01D7D5]/40 to-[#01D7D5]/10 rounded-t hover:from-[#01D7D5]/60 hover:to-[#01D7D5]/20 transition-all"
                        style={{ height: `${h * 2}px` }}
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
                <h3 className="text-white font-medium mb-4">Order Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Completed', value: 65, color: '#01D7D5' },
                    { label: 'Processing', value: 18, color: '#3B82F6' },
                    { label: 'Pending', value: 10, color: '#F59E0B' },
                    { label: 'Canceled', value: 5, color: '#EF4444' },
                    { label: 'Refunded', value: 2, color: '#484F58' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8B949E]">{item.label}</span>
                        <span className="text-white">{item.value}%</span>
                      </div>
                      <div className="w-full bg-[#30363D] rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[#01D7D5] text-xs hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                      {['Order #', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white">{o.id}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.customer}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{o.product}</td>
                        <td className="py-3 px-3 text-white">{o.amount} DZD</td>
                        <td className="py-3 px-3">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#484F58]">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-[#01D7D5]" />
                <h3 className="text-white font-medium">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="bg-[rgba(1,215,213,0.1)] border-l-[3px] border-[#01D7D5] rounded-r-lg p-4">
                    <p className="text-[#8B949E] text-sm">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Marketers */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Top Marketers</h3>
                <button onClick={() => setActiveTab('marketers')} className="text-[#01D7D5] text-xs hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                      {['Name', 'Rank', 'Sales', 'Commission', 'Team', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topMarketers.map((m, idx) => (
                      <tr key={idx} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-3 text-white">{m.name}</td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-[#FFD700]">{m.rank}</span>
                        </td>
                        <td className="py-3 px-3 text-white">{m.sales}</td>
                        <td className="py-3 px-3 text-[#01D7D5]">{m.commission}</td>
                        <td className="py-3 px-3 text-[#8B949E]">{m.team}</td>
                        <td className="py-3 px-3">
                          <button className="text-[#01D7D5] text-xs hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <p className="text-[#8B949E] text-sm">This admin section is under development.</p>
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
          <div className="px-3 pb-1">
            <span className="px-4 text-[10px] uppercase tracking-wider text-[#484F58] font-medium">Admin</span>
          </div>
          <nav className="px-3 pb-4">
            {adminNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
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
                <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Admin</p>
                  <p className="text-[#8B949E] text-[11px]">Super Admin</p>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-semibold text-xl capitalize">
              {adminNavItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={18} className="text-[#8B949E]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
