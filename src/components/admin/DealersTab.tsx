import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Plus, Edit2, Trash2, Search } from 'lucide-react'
import StatusBadge from './StatusBadge'

const dealers = [
  { id: 1, name: 'Nexivora London', city: 'London', address: '45 Electric Avenue, London', phone: '+44 20 7946 0958', email: 'london@nexivora.com', hours: 'Mon-Sat 9AM-6PM', status: 'active', sales: '12.5M', manager: 'James Mitchell' },
  { id: 2, name: 'Nexivora Paris', city: 'Paris', address: '78 Rue de la Mobilité, Paris', phone: '+33 1 42 86 82 00', email: 'paris@nexivora.com', hours: 'Mon-Sat 9AM-7PM', status: 'active', sales: '9.8M', manager: 'Marie Dubois' },
  { id: 3, name: 'Nexivora Dubai', city: 'Dubai', address: '12 Sheikh Zayed Road, Dubai', phone: '+971 4 123 4567', email: 'dubai@nexivora.com', hours: 'Sun-Thu 9AM-8PM', status: 'active', sales: '8.2M', manager: 'Omar Hassan' },
  { id: 4, name: 'Nexivora New York', city: 'New York', address: '350 5th Avenue, New York', phone: '+1 212-736-3100', email: 'newyork@nexivora.com', hours: 'Mon-Sat 10AM-7PM', status: 'active', sales: '11.3M', manager: 'Sarah Chen' },
  { id: 5, name: 'Nexivora Tokyo', city: 'Tokyo', address: '1-1 Shibuya Crossing, Tokyo', phone: '+81 3-1234-5678', email: 'tokyo@nexivora.com', hours: 'Mon-Sat 10AM-8PM', status: 'active', sales: '7.1M', manager: 'Yuki Tanaka' },
  { id: 6, name: 'Nexivora Sydney', city: 'Sydney', address: '100 Harbour Street, Sydney', phone: '+61 2 9374 4000', email: 'sydney@nexivora.com', hours: 'Mon-Sat 9AM-6PM', status: 'inactive', sales: '0', manager: 'Emma Wilson' },
]

export default function DealersTab() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const filtered = dealers.filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Dealers', value: `${dealers.length}` },
          { label: 'Active', value: `${dealers.filter((d) => d.status === 'active').length}` },
          { label: 'Top Dealer', value: 'Nexivora HQ' },
          { label: 'Total Sales', value: 'DZD 20.5M' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#01D7D5] text-black font-medium text-sm rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
          <Plus size={16} /> Add Dealer
        </button>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dealers..."
            className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {['Dealer', 'City', 'Contact', 'Hours', 'Status', 'Sales', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <p className="text-white text-sm">{d.name}</p>
                      <p className="text-[#484F58] text-[10px] flex items-center gap-1"><MapPin size={10} />{d.address}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#8B949E]">{d.city}</td>
                  <td className="py-3 px-3">
                    <div className="text-[#484F58] text-xs space-y-0.5">
                      <p className="flex items-center gap-1"><Phone size={10} />{d.phone}</p>
                      <p className="flex items-center gap-1"><Mail size={10} />{d.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#484F58] text-xs flex items-center gap-1"><Clock size={10} />{d.hours}</td>
                  <td className="py-3 px-3"><StatusBadge status={d.status} /></td>
                  <td className="py-3 px-3 text-[#01D7D5]">DZD {d.sales}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 text-[#484F58] hover:text-[#01D7D5] transition-colors rounded hover:bg-[rgba(1,215,213,0.1)]"><Edit2 size={14} /></button>
                      <button className="p-1.5 text-[#484F58] hover:text-[#EF4444] transition-colors rounded hover:bg-[rgba(239,68,68,0.1)]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales by Dealer Chart */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Sales by Dealer</h3>
        <div className="space-y-3">
          {dealers.filter((d) => d.status === 'active').sort((a, b) => parseFloat(b.sales) - parseFloat(a.sales)).map((d) => (
            <div key={d.id} className="flex items-center gap-3">
              <span className="w-28 text-white text-xs truncate">{d.city}</span>
              <div className="flex-1 bg-[#30363D] rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-[#01D7D5] to-[#01D7D5]/60" style={{ width: `${(parseFloat(d.sales) / 8.5) * 100}%` }} />
              </div>
              <span className="w-20 text-right text-[#8B949E] text-xs">DZD {d.sales}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add New Dealer</h3>
              <button onClick={() => setShowForm(false)} className="text-[#484F58] hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Dealer Name" className="col-span-2 bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <input placeholder="City" className="bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <input placeholder="Phone" className="bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <input placeholder="Email" className="col-span-2 bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <input placeholder="Address" className="col-span-2 bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <input placeholder="Hours" className="col-span-2 bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-[#01D7D5] text-black font-medium text-sm rounded-lg">Add Dealer</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-[#30363D] text-[#8B949E] text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
