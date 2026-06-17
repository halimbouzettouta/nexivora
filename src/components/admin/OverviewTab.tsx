import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import StatusBadge from './StatusBadge'
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle, Brain } from 'lucide-react'
import { getOrders, getOrderStats } from '@/hooks/orderStore'
import { getCommissions, getCommissionStats } from '@/hooks/orderStore'
import { getMarketerAccounts } from '@/hooks/marketerAuth'
import type { Order } from '@/hooks/orderStore'

export default function OverviewTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const orderStats = getOrderStats()
  const commissionStats = getCommissionStats()
  const marketers = getMarketerAccounts()
  const commissions = getCommissions()

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  // Compute real revenue
  const totalRevenue = orderStats.totalRevenue
  const pendingCommissions = commissionStats.totalPending

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5)

  // Get top marketers by earnings
  const topMarketers = [...marketers].sort((a, b) => b.earnings - a.earnings).slice(0, 5)

  // Compute status distribution from real data
  const statusDist = [
    { label: 'Completed', count: orderStats.delivered, color: '#01D7D5' },
    { label: 'Processing', count: orderStats.processing, color: '#3B82F6' },
    { label: 'Pending', count: orderStats.pending, color: '#F59E0B' },
    { label: 'Canceled', count: orderStats.canceled, color: '#EF4444' },
  ].filter(s => s.count > 0)
  const totalWithStatus = statusDist.reduce((s, d) => s + d.count, 0) || 1

  const kpiData = [
    { label: 'Total Revenue', value: `DZD ${(totalRevenue / 1000000).toFixed(1)}M`, change: '+18%', icon: <TrendingUp size={20} /> },
    { label: 'Total Orders', value: String(orderStats.total), change: `+${orderStats.total}`, icon: <ShoppingCart size={20} /> },
    { label: 'Active Marketers', value: String(marketers.length), change: `+${marketers.length}`, icon: <Users size={20} /> },
    { label: 'Pending Commissions', value: `DZD ${(pendingCommissions / 1000).toFixed(0)}K`, change: `${commissions.filter(c => c.status === 'pending').length} pending`, icon: <DollarSign size={20} /> },
    { label: 'Low Stock Alerts', value: '3 products', change: 'Action needed', icon: <AlertTriangle size={20} />, warning: true },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpiData.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Revenue Trends</h3>
            <div className="flex gap-1">
              {['D', 'W', 'M', 'Y'].map((t) => (
                <button key={t} className={`px-3 py-1 rounded-md text-xs ${t === 'M' ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[200px] flex items-end gap-2">
            {[30, 45, 35, 60, 50, 75, 65, 80, 55, 70, 85, totalRevenue > 0 ? Math.min(90, Math.round(totalRevenue / 10000)) : 30].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                <div className="w-full bg-gradient-to-t from-[#01D7D5]/40 to-[#01D7D5]/10 rounded-t hover:from-[#01D7D5]/70 hover:to-[#01D7D5]/30 transition-all" style={{ height: `${Math.min(h, 100) * 2}px` }} />
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
            {statusDist.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#8B949E]">{item.label}</span>
                  <span className="text-white">{Math.round((item.count / totalWithStatus) * 100)}%</span>
                </div>
                <div className="w-full bg-[#30363D] rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${(item.count / totalWithStatus) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
            {statusDist.length === 0 && <p className="text-[#484F58] text-sm text-center py-8">No order data yet</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[#484F58]">No orders yet</td></tr>
              )}
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.customerName}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.items.map(i => i.name).join(', ').slice(0, 30)}</td>
                  <td className="py-3 px-3 text-white">{o.total.toLocaleString()} DZD</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-3 text-[#484F58]">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Marketers */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Top Marketers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Name', 'Rank', 'Earnings', 'Referral Code'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topMarketers.map((m, idx) => (
                <tr key={idx} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium">{m.name.charAt(0)}</div>
                    {m.name}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={m.rank} /></td>
                  <td className="py-3 px-3 text-[#01D7D5]">DZD {m.earnings.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[#01D7D5] text-xs font-mono">{m.referralCode}</td>
                </tr>
              ))}
              {topMarketers.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-[#484F58]">No marketers registered yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
