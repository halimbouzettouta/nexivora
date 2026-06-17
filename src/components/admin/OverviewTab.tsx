import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import StatusBadge from './StatusBadge'
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react'
import { trpc } from '@/providers/trpc'

export default function OverviewTab() {
  const { data: orders = [] } = trpc.order.list.useQuery(undefined, { staleTime: 10000 })
  const { data: users = [] } = trpc.adminSetup.listUsers.useQuery(undefined, { staleTime: 30000 })

  // Compute real revenue
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
  const pendingCount = orders.filter((o: any) => o.status === 'pending').length
  const processingCount = orders.filter((o: any) => o.status === 'processing').length
  const deliveredCount = orders.filter((o: any) => o.status === 'delivered' || o.status === 'completed').length
  const canceledCount = orders.filter((o: any) => o.status === 'canceled' || o.status === 'refunded').length
  const totalMarketers = users.filter((u: any) => u.role === 'marketer' || u.role === 'admin').length

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5)

  // Compute status distribution from real data
  const statusDist = [
    { label: 'Completed', count: deliveredCount, color: '#01D7D5' },
    { label: 'Processing', count: processingCount, color: '#3B82F6' },
    { label: 'Pending', count: pendingCount, color: '#F59E0B' },
    { label: 'Canceled', count: canceledCount, color: '#EF4444' },
  ].filter(s => s.count > 0)
  const totalWithStatus = statusDist.reduce((s, d) => s + d.count, 0) || 1

  const kpiData = [
    { label: 'Total Revenue', value: `DZD ${(totalRevenue / 1000000).toFixed(1)}M`, change: '+18%', icon: <TrendingUp size={20} /> },
    { label: 'Total Orders', value: String(orders.length), change: `+${orders.length}`, icon: <ShoppingCart size={20} /> },
    { label: 'Active Marketers', value: String(totalMarketers), change: `+${totalMarketers}`, icon: <Users size={20} /> },
    { label: 'Pending Orders', value: String(pendingCount), change: `${pendingCount} pending`, icon: <DollarSign size={20} /> },
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
              {recentOrders.map((o: any) => (
                <tr key={o.id || o.orderNumber} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.products || `${o.itemCount || 0} items`}</td>
                  <td className="py-3 px-3 text-white">{Number(o.total).toLocaleString()} DZD</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-3 text-[#484F58]">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td>
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
                {['Name', 'Role', 'Status', 'Joined'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.filter((u: any) => u.role === 'marketer' || u.role === 'admin').slice(0, 5).map((m: any, idx: number) => (
                <tr key={m.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium">{(m.name || 'U').charAt(0)}</div>
                    {m.name || 'Anonymous'}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={m.role} /></td>
                  <td className="py-3 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(1,215,213,0.15)] text-[#01D7D5]">{m.status}</span></td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}</td>
                </tr>
              ))}
              {users.filter((u: any) => u.role === 'marketer' || u.role === 'admin').length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-[#484F58]">No marketers registered yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
