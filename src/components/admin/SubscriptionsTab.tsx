import { useState } from 'react'
import { CreditCard, CheckCircle, Clock, AlertTriangle, Edit2, Plus } from 'lucide-react'
import StatusBadge from './StatusBadge'

const activeSubs = [
  { id: 1, customer: 'Ahmed Benali', plan: 'Premium Maintenance', price: '1,500', cycle: 'monthly', status: 'active', startDate: '2025-01-15', nextBilling: '2025-07-15', product: 'Nexivora City Pro' },
  { id: 2, customer: 'Karim Hadj', plan: 'Basic Maintenance', price: '500', cycle: 'monthly', status: 'active', startDate: '2025-03-01', nextBilling: '2025-07-01', product: 'Nexivora Trail Blazer' },
  { id: 3, customer: 'Sofia Mansouri', plan: 'Extended Warranty', price: '15,000', cycle: 'one_time', status: 'active', startDate: '2025-02-10', nextBilling: '2026-02-10', product: 'Nexivora Mountain X' },
  { id: 4, customer: 'Omar Khalef', plan: 'Premium Maintenance', price: '1,500', cycle: 'monthly', status: 'canceled', startDate: '2024-10-01', nextBilling: '—', product: 'Nexivora City Pro' },
  { id: 5, customer: 'Yasmine D.', plan: 'Basic Maintenance', price: '500', cycle: 'monthly', status: 'active', startDate: '2025-05-20', nextBilling: '2025-07-20', product: 'Nexivora Urban Glide' },
]

const maintenanceRequests = [
  { id: 1, customer: 'Ahmed Benali', product: 'Nexivora City Pro', issue: 'Battery not charging fully', status: 'scheduled', date: '2025-06-15', dealer: 'Nexivora HQ' },
  { id: 2, customer: 'Karim Hadj', product: 'Nexivora Trail Blazer', issue: 'Brake adjustment needed', status: 'completed', date: '2025-06-08', dealer: 'Nexivora Paris' },
  { id: 3, customer: 'Sofia M.', product: 'Nexivora Mountain X', issue: 'Motor noise', status: 'pending', date: '2025-06-12', dealer: 'Nexivora HQ' },
]

const plans = [
  { id: 1, name: 'Basic Maintenance', price: '500', cycle: 'monthly', subscribers: 89, features: ['Monthly inspection', '10% parts discount', 'Priority scheduling'] },
  { id: 2, name: 'Premium Maintenance', price: '1,500', cycle: 'monthly', subscribers: 45, features: ['Weekly check-ups', '25% parts discount', 'Free battery diagnostics', 'Emergency roadside', 'Free software updates'] },
  { id: 3, name: 'Extended Warranty', price: '15,000', cycle: 'one_time', subscribers: 67, features: ['1 additional year', 'Full parts replacement', 'Free labor', 'Transferable'] },
]

export default function SubscriptionsTab() {
  const [activeView, setActiveView] = useState<'subscriptions' | 'requests' | 'plans'>('subscriptions')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Subscriptions', value: '201', icon: <CreditCard size={18} /> },
          { label: 'Monthly Recurring', value: 'DZD 201K', icon: <Clock size={18} /> },
          { label: 'Pending Requests', value: '8', icon: <AlertTriangle size={18} /> },
          { label: 'Completed This Month', value: '42', icon: <CheckCircle size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#484F58]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-b border-[#30363D]">
        {(['subscriptions', 'requests', 'plans'] as const).map((v) => (
          <button key={v} onClick={() => setActiveView(v)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeView === v ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#484F58] border-transparent hover:text-white'}`}>
            {v === 'requests' ? 'Maintenance Requests' : v === 'plans' ? 'Plan Configuration' : 'Active Subscriptions'}
          </button>
        ))}
      </div>

      {activeView === 'subscriptions' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Customer', 'Plan', 'Price', 'Status', 'Start Date', 'Next Billing', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {activeSubs.map((s) => (
                  <tr key={s.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{s.customer}</td>
                    <td className="py-3 px-3 text-[#8B949E]">{s.plan}</td>
                    <td className="py-3 px-3 text-white">DZD {s.price}<span className="text-[#484F58] text-[10px]">/{s.cycle === 'one_time' ? 'once' : 'mo'}</span></td>
                    <td className="py-3 px-3"><StatusBadge status={s.status} /></td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{s.startDate}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{s.nextBilling}</td>
                    <td className="py-3 px-3"><button className="p-1.5 text-[#484F58] hover:text-[#01D7D5]"><Edit2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'requests' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Customer', 'Product', 'Issue', 'Status', 'Date', 'Dealer'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map((r) => (
                  <tr key={r.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{r.customer}</td>
                    <td className="py-3 px-3 text-[#8B949E]">{r.product}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{r.issue}</td>
                    <td className="py-3 px-3"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{r.date}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{r.dealer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{plan.name}</h4>
                <button className="p-1.5 text-[#484F58] hover:text-[#01D7D5]"><Edit2 size={14} /></button>
              </div>
              <p className="text-[#01D7D5] font-semibold text-xl mb-1">DZD {plan.price}<span className="text-[#484F58] text-sm font-normal">/{plan.cycle === 'one_time' ? 'one-time' : 'mo'}</span></p>
              <p className="text-[#484F58] text-xs mb-4">{plan.subscribers} subscribers</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[#8B949E] text-xs"><CheckCircle size={12} className="text-[#01D7D5]" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
          <button className="bg-[#161B22] border border-dashed border-[#30363D] rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#01D7D5] transition-colors min-h-[200px]">
            <Plus size={24} className="text-[#484F58]" />
            <span className="text-[#484F58] text-sm">Create New Plan</span>
          </button>
        </div>
      )}
    </div>
  )
}


