import { useState } from 'react'
import { Search, UserCircle, ShoppingBag, Star, Calendar, Mail, Phone } from 'lucide-react'

const customers = [
  { id: 1, name: 'John Mitchell', email: 'john@email.com', phone: '+1 555 123 4567', orders: 8, spent: '14,800', joined: '2023-10-15', lastOrder: '2025-06-05', segment: 'VIP', loyalty: 14800 },
  { id: 2, name: 'Sarah Williams', email: 'sarah@email.com', phone: '+44 20 7946 0958', orders: 5, spent: '6,425', joined: '2024-01-20', lastOrder: '2025-06-04', segment: 'Regular', loyalty: 6425 },
  { id: 3, name: 'David Chen', email: 'david@email.com', phone: '+1 415 555 7890', orders: 12, spent: '31,080', joined: '2023-08-05', lastOrder: '2025-06-03', segment: 'VIP', loyalty: 31080 },
  { id: 4, name: 'Emma Dubois', email: 'emma@email.com', phone: '+33 1 42 86 82 00', orders: 3, spent: '6,565', joined: '2024-03-10', lastOrder: '2025-05-28', segment: 'Regular', loyalty: 6565 },
  { id: 5, name: 'Michael Torres', email: 'michael@email.com', phone: '+1 212 555 3456', orders: 15, spent: '42,500', joined: '2023-06-01', lastOrder: '2025-06-05', segment: 'VIP', loyalty: 42500 },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@email.com', phone: '+61 2 9374 4000', orders: 2, spent: '360', joined: '2025-04-15', lastOrder: '2025-05-20', segment: 'New', loyalty: 360 },
  { id: 7, name: 'James Wilson', email: 'james@email.com', phone: '+44 20 7123 4567', orders: 6, spent: '11,100', joined: '2024-02-01', lastOrder: '2025-06-01', segment: 'Regular', loyalty: 11100 },
  { id: 8, name: 'Anna Schmidt', email: 'anna@email.com', phone: '+49 30 12345678', orders: 1, spent: '1,250', joined: '2025-05-20', lastOrder: '2025-05-25', segment: 'New', loyalty: 1250 },
]

const segmentColors: Record<string, string> = {
  VIP: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  Regular: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  New: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
}

export default function CustomersTab() {
  const [search, setSearch] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('All')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filtered = customers.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchSeg = segmentFilter === 'All' || c.segment === segmentFilter
    return matchSearch && matchSeg
  })

  const selected = customers.find((c) => c.id === selectedId)
  const segments = ['All', 'VIP', 'Regular', 'New']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: `${customers.length}` },
          { label: 'VIP', value: `${customers.filter((c) => c.segment === 'VIP').length}` },
          { label: 'New (This Month)', value: '12' },
          { label: 'Avg Spend', value: 'DZD 1.4M' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
                className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
            </div>
            <div className="flex gap-1">
              {segments.map((s) => (
                <button key={s} onClick={() => setSegmentFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs transition-colors ${segmentFilter === s ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                    {['Customer', 'Segment', 'Orders', 'Total Spent', 'Loyalty', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedId(c.id)}
                      className={`border-t border-[#30363D]/50 cursor-pointer transition-colors ${selectedId === c.id ? 'bg-[rgba(1,215,213,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-xs text-white font-medium">{c.name.charAt(0)}</div>
                          <div>
                            <p className="text-white text-sm">{c.name}</p>
                            <p className="text-[#484F58] text-[10px]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3"><span className={`text-[11px] px-2 py-1 rounded-full ${segmentColors[c.segment]}`}>{c.segment}</span></td>
                      <td className="py-3 px-3 text-white">{c.orders}</td>
                      <td className="py-3 px-3 text-[#01D7D5]">DZD {c.spent}</td>
                      <td className="py-3 px-3 text-[#8B949E] text-xs">{c.loyalty.toLocaleString()} pts</td>
                      <td className="py-3 px-3"><button className="p-1.5 text-[#484F58] hover:text-[#01D7D5]"><UserCircle size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#30363D] flex items-center justify-center text-xl font-semibold text-white">{selected.name.charAt(0)}</div>
                <div>
                  <h4 className="text-white font-semibold">{selected.name}</h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${segmentColors[selected.segment]}`}>{selected.segment}</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Email', value: selected.email, icon: <Mail size={14} /> },
                  { label: 'Phone', value: selected.phone, icon: <Phone size={14} /> },
                  { label: 'Total Orders', value: `${selected.orders}`, icon: <ShoppingBag size={14} /> },
                  { label: 'Total Spent', value: `DZD ${selected.spent}`, icon: <Star size={14} /> },
                  { label: 'Loyalty Points', value: `${selected.loyalty.toLocaleString()} pts`, icon: <Star size={14} /> },
                  { label: 'Member Since', value: selected.joined, icon: <Calendar size={14} /> },
                  { label: 'Last Order', value: selected.lastOrder, icon: <ShoppingBag size={14} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#30363D]/50">
                    <span className="flex items-center gap-2 text-[#484F58] text-xs"><span className="text-[#01D7D5]">{item.icon}</span>{item.label}</span>
                    <span className="text-white text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 border border-[#30363D] text-[#8B949E] text-xs rounded-lg hover:border-[#01D7D5] hover:text-white transition-colors">
                View Full Profile
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCircle size={32} className="text-[#30363D] mx-auto mb-3" />
              <p className="text-[#484F58] text-sm">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
