import { Brain, TrendingUp, Users, ShoppingCart, Target, Zap, Lightbulb, AlertTriangle } from 'lucide-react'

const kpiCards = [
  { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: <Target size={18} />, color: '#01D7D5' },
  { label: 'Avg Order Value', value: 'DZD 15,800', change: '+5%', icon: <ShoppingCart size={18} />, color: '#3B82F6' },
  { label: 'Customer LTV', value: 'DZD 485K', change: '+12%', icon: <Users size={18} />, color: '#F59E0B' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%', icon: <TrendingUp size={18} />, color: '#01D7D5' },
]

const topProducts = [
  { name: 'Nexivora City Pro', sales: 142, revenue: '26.3M', trend: '+24%' },
  { name: 'Nexivora Urban Glide', sales: 98, revenue: '12.3M', trend: '+18%' },
  { name: 'Nexivora Trail Blazer', sales: 67, revenue: '17.4M', trend: '+32%' },
  { name: 'Nexivora Mountain X', sales: 45, revenue: '14.4M', trend: '+15%' },
  { name: 'Nexivora Air Helmet', sales: 312, revenue: '2.7M', trend: '+8%' },
]

const acquisitionFunnel = [
  { stage: 'Visitors', count: 45200, color: '#01D7D5' },
  { stage: 'Product Views', count: 18500, color: '#3B82F6' },
  { stage: 'Add to Cart', count: 6200, color: '#F59E0B' },
  { stage: 'Checkout', count: 3400, color: '#F59E0B' },
  { stage: 'Purchases', count: 2840, color: '#01D7D5' },
]

const aiInsights = [
  { icon: <Zap size={14} />, text: 'Product "Nexivora City Pro" is trending up 34% — consider increasing stock to 25 units', type: 'trend' },
  { icon: <AlertTriangle size={14} />, text: 'Marketer Ahmed B. has 0 sales this week — a follow-up message may help re-engage', type: 'alert' },
  { icon: <Lightbulb size={14} />, text: 'Weekend conversion rate is 23% higher — schedule campaigns for Friday/Saturday', type: 'insight' },
  { icon: <AlertTriangle size={14} />, text: '3 accounts (IDs: 44, 67, 91) show suspicious activity pattern — review recommended', type: 'warning' },
  { icon: <Zap size={14} />, text: 'Oran region showing 45% growth — consider opening a second dealer location', type: 'trend' },
  { icon: <Lightbulb size={14} />, text: 'Customers who buy helmets with scooters have 40% higher repeat purchase rate', type: 'insight' },
]

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 hover:border-[#484F58] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#484F58] font-medium">{kpi.label}</span>
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
            </div>
            <p className="text-white font-semibold text-2xl mb-1">{kpi.value}</p>
            <span className="text-[#01D7D5] text-xs">{kpi.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 text-center text-[#484F58] text-xs font-medium">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{p.name}</span>
                    <div className="flex gap-3">
                      <span className="text-[#8B949E] text-xs">{p.sales} sold</span>
                      <span className="text-[#01D7D5] text-xs">DZD {p.revenue}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#30363D] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#01D7D5]/60" style={{ width: `${(p.sales / 312) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Funnel */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Acquisition Funnel</h3>
          <div className="space-y-3">
            {acquisitionFunnel.map((stage, idx) => {
              const prevCount = idx > 0 ? acquisitionFunnel[idx - 1].count : stage.count
              const dropoff = idx > 0 ? (((prevCount - stage.count) / prevCount) * 100).toFixed(0) : null
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">{stage.stage}</span>
                    <div className="flex gap-2">
                      <span className="text-[#8B949E]">{stage.count.toLocaleString()}</span>
                      {dropoff && <span className="text-[#EF4444]">-{dropoff}%</span>}
                    </div>
                  </div>
                  <div className="w-full bg-[#30363D] rounded-full h-3">
                    <div className="h-3 rounded-full transition-all" style={{ width: `${(stage.count / acquisitionFunnel[0].count) * 100}%`, backgroundColor: stage.color }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 p-3 bg-[#0A0A0A] rounded-lg">
            <p className="text-[#484F58] text-xs">Overall conversion: <span className="text-[#01D7D5]">6.3%</span> (visitor to purchase)</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-[#01D7D5]" />
          <h3 className="text-white font-medium">AI-Powered Insights</h3>
          <span className="ml-auto text-[10px] text-[#484F58] uppercase tracking-wider bg-[#0A0A0A] px-2 py-1 rounded">Auto-generated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="bg-[rgba(1,215,213,0.05)] border-l-[3px] border-[#01D7D5] rounded-r-lg p-4 flex items-start gap-3">
              <span className="text-[#01D7D5] mt-0.5 flex-shrink-0">{insight.icon}</span>
              <p className="text-[#8B949E] text-sm">{insight.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="px-6 py-2.5 border border-[#30363D] text-[#8B949E] text-sm rounded-lg hover:border-[#01D7D5] hover:text-white transition-colors flex items-center gap-2 mx-auto">
            <Brain size={16} /> Generate New Campaign Suggestion
          </button>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Geographic Sales Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { city: 'Algiers', sales: '44%', amount: '18.5M' },
            { city: 'Oran', sales: '19%', amount: '8.2M' },
            { city: 'Constantine', sales: '14%', amount: '6.1M' },
            { city: 'Annaba', sales: '10%', amount: '4.3M' },
            { city: 'Setif', sales: '9%', amount: '3.8M' },
            { city: 'Blida', sales: '4%', amount: '1.6M' },
          ].map((city) => (
            <div key={city.city} className="bg-[#0A0A0A] rounded-lg p-3 text-center">
              <p className="text-white text-sm font-medium">{city.city}</p>
              <p className="text-[#01D7D5] text-lg font-semibold">{city.sales}</p>
              <p className="text-[#484F58] text-xs">DZD {city.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
