import { useState } from 'react'
import { DollarSign, CheckCircle, XCircle, Download, Wallet, PieChart, TrendingUp } from 'lucide-react'
import StatusBadge from './StatusBadge'

const stats = [
  { label: 'Total Earned', value: 'DZD 1.8M', icon: <DollarSign size={18} /> },
  { label: 'Available', value: 'DZD 245K', icon: <Wallet size={18} /> },
  { label: 'Pending', value: 'DZD 82K', icon: <TrendingUp size={18} /> },
  { label: 'Withdrawn', value: 'DZD 1.47M', icon: <PieChart size={18} /> },
]

const transactions = [
  { id: 1, marketer: 'Ahmed Benali', order: 'ER-1289', amount: '9,250', type: 'direct', status: 'paid', date: '2025-06-05' },
  { id: 2, marketer: 'Yasmine D.', order: 'ER-1288', amount: '6,250', type: 'direct', status: 'pending', date: '2025-06-05' },
  { id: 3, marketer: 'Karim Hadj', order: 'ER-1287', amount: '12,950', type: 'direct', status: 'paid', date: '2025-06-04' },
  { id: 4, marketer: 'Omar Khalef', order: 'ER-1286', amount: '16,000', type: 'team', status: 'pending', date: '2025-06-04' },
  { id: 5, marketer: 'Sofia M.', order: 'ER-1285', amount: '425', type: 'direct', status: 'paid', date: '2025-06-03' },
  { id: 6, marketer: 'Lina Bouzid', order: 'ER-1284', amount: '8,500', type: 'direct', status: 'pending', date: '2025-06-03' },
  { id: 7, marketer: 'Rachid M.', order: 'ER-1283', amount: '4,200', type: 'team', status: 'paid', date: '2025-06-02' },
  { id: 8, marketer: 'Nadia B.', order: 'ER-1282', amount: '3,100', type: 'direct', status: 'pending', date: '2025-06-01' },
]

const withdrawals = [
  { id: 1, marketer: 'Ahmed Benali', amount: '50,000', method: 'bank', status: 'pending', date: '2025-06-05' },
  { id: 2, marketer: 'Omar Khalef', amount: '100,000', method: 'ccp', status: 'approved', date: '2025-06-04' },
  { id: 3, marketer: 'Lina Bouzid', amount: '75,000', method: 'bank', status: 'pending', date: '2025-06-03' },
  { id: 4, marketer: 'Karim Hadj', amount: '30,000', method: 'baridimob', status: 'approved', date: '2025-06-02' },
]

export default function CommissionsTab() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions')

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#01D7D5]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Commission Breakdown</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#30363D" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#01D7D5" strokeWidth="12" strokeDasharray={`${0.65 * 251.2} ${251.2}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white text-lg font-semibold">65%</span>
                <span className="text-[#484F58] text-[10px]">Direct</span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              {[
                { label: 'Direct Commission (5%)', value: 'DZD 1.17M', percent: 65, color: '#01D7D5' },
                { label: 'Team Bonus (5% pool)', value: 'DZD 630K', percent: 35, color: '#3B82F6' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{item.label}</span>
                    <span className="text-[#8B949E]">{item.value}</span>
                  </div>
                  <div className="w-full bg-[#30363D] rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">This Month</h3>
          <div className="space-y-4">
            {[
              { label: 'Direct Commissions', value: 'DZD 98,500', change: '+12%' },
              { label: 'Team Bonuses', value: 'DZD 52,300', change: '+18%' },
              { label: 'Withdrawals', value: 'DZD 125,000', change: '+5%' },
              { label: 'Pending Payouts', value: 'DZD 82,000', change: '8 reqs' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#30363D]/50">
                <span className="text-[#8B949E] text-xs">{item.label}</span>
                <div className="text-right">
                  <p className="text-white text-sm">{item.value}</p>
                  <p className="text-[#01D7D5] text-[10px]">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#30363D]">
        {(['transactions', 'withdrawals'] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#484F58] border-transparent hover:text-white'}`}>
            {t === 'withdrawals' ? 'Withdrawal Requests' : 'Transactions'}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-[#30363D] rounded-lg text-xs text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {activeTab === 'transactions' ? (
                  <>{['Marketer', 'Order', 'Amount', 'Type', 'Status', 'Date'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}</>
                ) : (
                  <>{['Marketer', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}</>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'transactions' ? transactions.map((t) => (
                <tr key={t.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white">{t.marketer}</td>
                  <td className="py-3 px-3 text-[#484F58] font-mono text-xs">{t.order}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">{t.amount} DZD</td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs capitalize">{t.type}</td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{t.date}</td>
                </tr>
              )) : withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white">{w.marketer}</td>
                  <td className="py-3 px-3 text-[#01D7D5]">{w.amount} DZD</td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs uppercase">{w.method}</td>
                  <td className="py-3 px-3"><StatusBadge status={w.status} /></td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{w.date}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1.5">
                      {w.status === 'pending' && (
                        <>
                          <button className="p-1.5 text-[#01D7D5] hover:bg-[rgba(1,215,213,0.1)] rounded transition-colors"><CheckCircle size={14} /></button>
                          <button className="p-1.5 text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded transition-colors"><XCircle size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
