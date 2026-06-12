import { useState } from 'react'
import { Download, TrendingUp, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react'
import StatCard from './StatCard'

const salesData = [
  { period: 'Today', revenue: '185,000', orders: 12, avgOrder: '15,400', growth: '+8%' },
  { period: 'This Week', revenue: '1,240,000', orders: 78, avgOrder: '15,900', growth: '+15%' },
  { period: 'This Month', revenue: '4,850,000', orders: 312, avgOrder: '15,500', growth: '+18%' },
  { period: 'This Year', revenue: '42,500,000', orders: 2840, avgOrder: '14,900', growth: '+24%' },
]

const salesByCategory = [
  { name: 'E-Bikes', sales: '18.2M', percent: 43, color: '#01D7D5' },
  { name: 'E-Scooters', sales: '15.8M', percent: 37, color: '#3B82F6' },
  { name: 'Accessories', sales: '5.4M', percent: 13, color: '#F59E0B' },
  { name: 'Parts', sales: '3.1M', percent: 7, color: '#484F58' },
]

const salesByRegion = [
  { city: 'Algiers', sales: '18.5M', orders: 1240, percent: 44 },
  { city: 'Oran', sales: '8.2M', orders: 580, percent: 19 },
  { city: 'Constantine', sales: '6.1M', orders: 420, percent: 14 },
  { city: 'Annaba', sales: '4.3M', orders: 310, percent: 10 },
  { city: 'Setif', sales: '3.8M', orders: 260, percent: 9 },
]

const monthlyBars = [28, 42, 35, 55, 48, 72, 65, 78, 58, 68, 85, 92]

export default function SalesTab() {
  const [period, setPeriod] = useState('monthly')

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value="DZD 185K" change="+8%" icon={<DollarSign size={20} />} />
        <StatCard label="Weekly Revenue" value="DZD 1.24M" change="+15%" icon={<TrendingUp size={20} />} />
        <StatCard label="Monthly Revenue" value="DZD 4.85M" change="+18%" icon={<BarChart3 size={20} />} />
        <StatCard label="Net Profit" value="DZD 1.46M" change="+22%" positive icon={<ShoppingBag size={20} />} />
      </div>

      {/* Period Selector + Export */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#161B22] border border-[#30363D] rounded-lg p-1">
          {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-xs capitalize transition-colors ${period === p ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#30363D] rounded-lg text-sm text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Revenue Overview</h3>
        <div className="h-[250px] flex items-end gap-2">
          {monthlyBars.map((h, i) => (
            <div key={i} className="flex-1 group cursor-pointer relative">
              <div className="w-full bg-gradient-to-t from-[#01D7D5]/50 to-[#01D7D5]/10 rounded-t hover:from-[#01D7D5]/80 hover:to-[#01D7D5]/30 transition-all" style={{ height: `${h * 2.5}px` }} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales by Category */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Sales by Category</h3>
          <div className="space-y-4">
            {salesByCategory.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{cat.name}</span>
                  <div className="flex gap-3">
                    <span className="text-[#8B949E]">{cat.sales}</span>
                    <span className="text-[#484F58]">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#30363D] rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Region */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Sales by Region</h3>
          <div className="space-y-3">
            {salesByRegion.map((region) => (
              <div key={region.city} className="flex items-center gap-3">
                <div className="w-24 text-sm text-white">{region.city}</div>
                <div className="flex-1 bg-[#30363D] rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#01D7D5]/60" style={{ width: `${region.percent}%` }} />
                </div>
                <div className="w-20 text-right">
                  <span className="text-white text-sm">{region.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Sales Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Period', 'Revenue', 'Orders', 'Avg Order', 'Growth'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesData.map((s) => (
                <tr key={s.period} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white">{s.period}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">DZD {s.revenue}</td>
                  <td className="py-3 px-3 text-white">{s.orders}</td>
                  <td className="py-3 px-3 text-[#8B949E]">DZD {s.avgOrder}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">{s.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
