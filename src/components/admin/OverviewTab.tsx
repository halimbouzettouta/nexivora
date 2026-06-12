import StatCard from './StatCard'
import StatusBadge from './StatusBadge'
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle, Brain } from 'lucide-react'

const kpiData = [
  { label: 'Total Revenue', value: 'DZD 12.5M', change: '+18%', icon: <TrendingUp size={20} /> },
  { label: 'Total Orders', value: '342', change: '+24', icon: <ShoppingCart size={20} /> },
  { label: 'Active Marketers', value: '156', change: '+12', icon: <Users size={20} /> },
  { label: 'Pending Commissions', value: 'DZD 245K', change: '12 pending', icon: <DollarSign size={20} /> },
  { label: 'Low Stock Alerts', value: '3 products', change: 'Action needed', icon: <AlertTriangle size={20} />, warning: true },
]

const recentOrders = [
  { id: 'ER-1289', customer: 'Ahmed Benali', product: 'E-Ride City Pro', amount: '185,000', status: 'completed', date: '2025-06-05' },
  { id: 'ER-1288', customer: 'Yasmine D.', product: 'E-Ride Urban Glide', amount: '125,000', status: 'processing', date: '2025-06-05' },
  { id: 'ER-1287', customer: 'Karim Hadj', product: 'E-Ride Trail Blazer', amount: '259,000', status: 'shipped', date: '2025-06-04' },
  { id: 'ER-1286', customer: 'Sofia M.', product: 'E-Ride Mountain X', amount: '320,000', status: 'completed', date: '2025-06-04' },
  { id: 'ER-1285', customer: 'Omar Khalef', product: 'E-Ride Air Helmet', amount: '8,500', status: 'pending', date: '2025-06-03' },
]

const topMarketers = [
  { name: 'Omar Khalef', rank: 'Diamond', sales: '5.8M', commission: '290K', team: 67 },
  { name: 'Ahmed Benali', rank: 'Diamond', sales: '4.2M', commission: '210K', team: 45 },
  { name: 'Karim Hadj', rank: 'Platinum', sales: '3.1M', commission: '155K', team: 32 },
  { name: 'Yasmine D.', rank: 'Gold', sales: '2.4M', commission: '120K', team: 28 },
  { name: 'Sofia M.', rank: 'Gold', sales: '1.9M', commission: '95K', team: 21 },
]

const aiInsights = [
  { text: 'Product "E-Ride City Pro" is trending up 34% — consider increasing stock', type: 'trend' },
  { text: 'Marketer Ahmed B. has 0 sales this week — may need support', type: 'alert' },
  { text: 'Weekend conversion rate is 23% higher — schedule campaigns accordingly', type: 'insight' },
  { text: '3 accounts show suspicious activity pattern — review recommended', type: 'warning' },
]

const revenueBars = [30, 45, 35, 60, 50, 75, 65, 80, 55, 70, 85, 90]
const statusDistribution = [
  { label: 'Completed', value: 65, color: '#01D7D5' },
  { label: 'Processing', value: 18, color: '#3B82F6' },
  { label: 'Pending', value: 10, color: '#F59E0B' },
  { label: 'Canceled', value: 5, color: '#EF4444' },
  { label: 'Refunded', value: 2, color: '#484F58' },
]

export default function OverviewTab() {
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
            {revenueBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                <div className="w-full bg-gradient-to-t from-[#01D7D5]/40 to-[#01D7D5]/10 rounded-t hover:from-[#01D7D5]/70 hover:to-[#01D7D5]/30 transition-all" style={{ height: `${h * 2}px` }} />
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
            {statusDistribution.map((item) => (
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
        <h3 className="text-white font-medium mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Order #', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white font-mono text-xs">{o.id}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.customer}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{o.product}</td>
                  <td className="py-3 px-3 text-white">{o.amount} DZD</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
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
          <span className="ml-auto text-[10px] text-[#484F58] uppercase tracking-wider">Auto-generated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="bg-[rgba(1,215,213,0.08)] border-l-[3px] border-[#01D7D5] rounded-r-lg p-4">
              <p className="text-[#8B949E] text-sm">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Marketers */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Top Marketers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider">
                {['Name', 'Rank', 'Sales', 'Commission', 'Team'].map((h) => (
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
                  <td className="py-3 px-3 text-white">{m.sales}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">{m.commission}</td>
                  <td className="py-3 px-3 text-[#8B949E]">{m.team} members</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
