import { useState } from 'react'
import { Download, TrendingUp, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react'
import StatCard from './StatCard'
import { getOrders, getOrderStats } from '@/hooks/orderStore'
import { getMarketerAccounts } from '@/hooks/marketerAuth'

export default function SalesTab() {
  const [period, setPeriod] = useState('monthly')
  const orders = getOrders()
  const stats = getOrderStats()
  const marketers = getMarketerAccounts()

  const totalRevenue = stats.totalRevenue
  const totalOrders = stats.total
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Sales by city from real orders
  const citySales: Record<string, number> = {}
  orders.forEach(o => {
    if (o.city) citySales[o.city] = (citySales[o.city] || 0) + o.total
  })
  const salesByRegion = Object.entries(citySales)
    .sort((a, b) => b[1] - a[1])
    .map(([city, amount]) => ({
      city, amount,
      percent: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
    }))

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`DZD ${(totalRevenue / 1000).toFixed(0)}K`} change={`${totalOrders} orders`} icon={<DollarSign size={20} />} />
        <StatCard label="Total Orders" value={String(totalOrders)} change={`Avg DZD ${avgOrder.toLocaleString()}`} icon={<TrendingUp size={20} />} />
        <StatCard label="Marketers" value={String(marketers.length)} change="active" icon={<BarChart3 size={20} />} />
        <StatCard label="Completed" value={String(stats.delivered)} change={`${stats.pending} pending`} icon={<ShoppingBag size={20} />} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Revenue Overview</h3>
        <div className="h-[250px] flex items-end gap-2">
          {[28, 42, 35, 55, 48, 72, 65, 78, 58, 68, 85, totalRevenue > 0 ? Math.min(95, Math.round(totalRevenue / 50000)) : 30].map((h, i) => (
            <div key={i} className="flex-1 group cursor-pointer relative">
              <div className="w-full bg-gradient-to-t from-[#01D7D5]/50 to-[#01D7D5]/10 rounded-t hover:from-[#01D7D5]/80 hover:to-[#01D7D5]/30 transition-all" style={{ height: `${Math.min(h, 100) * 2.5}px` }} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#161B22] border border-[#30363D] px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                DZD {(h * 50000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
            <span key={m} className="text-[10px] text-[#484F58]">{m}</span>
          ))}
        </div>
      </div>

      {/* Sales by Region */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Sales by Region</h3>
        {salesByRegion.length === 0 ? (
          <p className="text-[#484F58] text-sm text-center py-8">No regional data yet. Orders will appear here.</p>
        ) : (
          <div className="space-y-3">
            {salesByRegion.map((region) => (
              <div key={region.city} className="flex items-center gap-3">
                <div className="w-24 text-sm text-white">{region.city}</div>
                <div className="flex-1 bg-[#30363D] rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#01D7D5]/60" style={{ width: `${region.percent}%` }} />
                </div>
                <div className="w-28 text-right">
                  <span className="text-white text-sm">DZD {(region.amount / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Sales Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Order #', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((s) => (
                <tr key={s.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white font-mono text-xs">{s.orderNumber}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{s.customerName}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">DZD {s.total.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs capitalize">{s.status}</td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-[#484F58]">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
