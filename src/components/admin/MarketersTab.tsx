import { useState } from 'react'
import { Search, UserCheck, UserX, Eye, Mail, TrendingUp, Users, Award, Edit2, Ban, CheckCircle, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface Marketer {
  id: number
  name: string
  email: string
  phone: string
  rank: string
  status: string
  sales: string
  commission: string
  team: number
  joined: string
  referrals: number
}

const INITIAL_MARKETERS: Marketer[] = [
  { id: 1, name: 'Omar Khalef', email: 'omar@email.com', phone: '0555-123456', rank: 'Diamond', status: 'active', sales: '5.8M', commission: '290K', team: 67, joined: '2023-08-15', referrals: 142 },
  { id: 2, name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '0555-234567', rank: 'Diamond', status: 'active', sales: '4.2M', commission: '210K', team: 45, joined: '2023-09-01', referrals: 98 },
  { id: 3, name: 'Karim Hadj', email: 'karim@email.com', phone: '0555-345678', rank: 'Platinum', status: 'active', sales: '3.1M', commission: '155K', team: 32, joined: '2023-10-12', referrals: 76 },
  { id: 4, name: 'Yasmine Djebbar', email: 'yasmine@email.com', phone: '0555-456789', rank: 'Gold', status: 'active', sales: '2.4M', commission: '120K', team: 28, joined: '2024-01-05', referrals: 54 },
  { id: 5, name: 'Sofia Mansouri', email: 'sofia@email.com', phone: '0555-567890', rank: 'Gold', status: 'active', sales: '1.9M', commission: '95K', team: 21, joined: '2024-02-20', referrals: 43 },
  { id: 6, name: 'Farid Taleb', email: 'farid@email.com', phone: '0555-678901', rank: 'Silver', status: 'frozen', sales: '850K', commission: '42K', team: 12, joined: '2024-05-10', referrals: 22 },
  { id: 7, name: 'Amel Chenouf', email: 'amel@email.com', phone: '0555-789012', rank: 'Silver', status: 'pending', sales: '0', commission: '0', team: 0, joined: '2025-06-01', referrals: 0 },
  { id: 8, name: 'Nadia Berrahal', email: 'nadia@email.com', phone: '0555-890123', rank: 'Silver', status: 'active', sales: '1.2M', commission: '60K', team: 15, joined: '2024-03-15', referrals: 31 },
  { id: 9, name: 'Rachid Meziane', email: 'rachid@email.com', phone: '0555-901234', rank: 'Gold', status: 'active', sales: '2.1M', commission: '105K', team: 25, joined: '2023-11-01', referrals: 48 },
  { id: 10, name: 'Lina Bouzid', email: 'lina@email.com', phone: '0555-012345', rank: 'Platinum', status: 'active', sales: '3.8M', commission: '190K', team: 38, joined: '2023-08-28', referrals: 89 },
]

const RANKS = ['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond']

export default function MarketersTab() {
  const [marketers, setMarketers] = useState<Marketer[]>(INITIAL_MARKETERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [rankFilter, setRankFilter] = useState('All')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMarketer, setEditMarketer] = useState<Marketer | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formRank, setFormRank] = useState('Silver')
  const [formStatus, setFormStatus] = useState('active')
  const [formSales, setFormSales] = useState('')
  const [formCommission, setFormCommission] = useState('')
  const [formTeam, setFormTeam] = useState('')

  const filtered = marketers.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || m.status === statusFilter.toLowerCase()
    const matchRank = rankFilter === 'All' || m.rank === rankFilter
    return matchSearch && matchStatus && matchRank
  })

  const selected = marketers.find((m) => m.id === selectedId)

  // Computed stats
  const total = marketers.length
  const active = marketers.filter((m) => m.status === 'active').length
  const pending = marketers.filter((m) => m.status === 'pending').length
  const frozen = marketers.filter((m) => m.status === 'frozen').length

  const handleToggleStatus = (id: number) => {
    setMarketers((prev) => prev.map((m) => {
      if (m.id !== id) return m
      const newStatus = m.status === 'active' ? 'frozen' : m.status === 'frozen' ? 'active' : 'active'
      return { ...m, status: newStatus }
    }))
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this marketer?')) {
      setMarketers((prev) => prev.filter((m) => m.id !== id))
      if (selectedId === id) setSelectedId(null)
    }
  }

  const openEdit = (m: Marketer) => {
    setEditMarketer(m)
    setFormName(m.name)
    setFormEmail(m.email)
    setFormPhone(m.phone)
    setFormRank(m.rank)
    setFormStatus(m.status)
    setFormSales(m.sales)
    setFormCommission(m.commission)
    setFormTeam(String(m.team))
  }

  const saveEdit = () => {
    if (!editMarketer || !formName || !formEmail) return
    setMarketers((prev) => prev.map((m) =>
      m.id === editMarketer.id
        ? { ...m, name: formName, email: formEmail, phone: formPhone, rank: formRank, status: formStatus, sales: formSales, commission: formCommission, team: parseInt(formTeam) || 0 }
        : m
    ))
    setEditMarketer(null)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Marketers', value: String(total), icon: <Users size={18} /> },
          { label: 'Active', value: String(active), icon: <UserCheck size={18} /> },
          { label: 'Pending', value: String(pending), icon: <Award size={18} /> },
          { label: 'Frozen', value: String(frozen), icon: <UserX size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#484F58]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold text-lg">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketers List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search marketers..."
                className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#01D7D5] focus:outline-none">
              {['All', 'Active', 'Pending', 'Frozen'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)}
              className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#01D7D5] focus:outline-none">
              {['All', ...RANKS].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                    <th className="text-left py-3 px-3">Name</th>
                    <th className="text-left py-3 px-3">Rank</th>
                    <th className="text-left py-3 px-3">Status</th>
                    <th className="text-left py-3 px-3">Sales</th>
                    <th className="text-left py-3 px-3">Team</th>
                    <th className="text-left py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} onClick={() => setSelectedId(m.id)}
                      className={`border-t border-[#30363D]/50 cursor-pointer transition-colors ${selectedId === m.id ? 'bg-[rgba(1,215,213,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium text-white">{m.name.charAt(0)}</div>
                          <div>
                            <p className="text-white text-sm">{m.name}</p>
                            <p className="text-[#484F58] text-xs">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3"><StatusBadge status={m.rank} /></td>
                      <td className="py-3 px-3"><StatusBadge status={m.status} /></td>
                      <td className="py-3 px-3 text-white">{m.sales}</td>
                      <td className="py-3 px-3 text-[#8B949E]">{m.team}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedId(m.id) }} className="p-1.5 text-[#484F58] hover:text-[#01D7D5] transition-colors rounded hover:bg-[rgba(1,215,213,0.1)]" title="View"><Eye size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); openEdit(m) }} className="p-1.5 text-[#484F58] hover:text-white transition-colors rounded hover:bg-[rgba(255,255,255,0.05)]" title="Edit"><Edit2 size={14} /></button>
                          <a href={`mailto:${m.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-[#484F58] hover:text-[#01D7D5] transition-colors rounded hover:bg-[rgba(1,215,213,0.1)]" title="Send Email"><Mail size={14} /></a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-[#484F58]">No marketers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#30363D] flex items-center justify-center text-xl font-semibold text-white">{selected.name.charAt(0)}</div>
                <div>
                  <h4 className="text-white font-semibold">{selected.name}</h4>
                  <p className="text-[#484F58] text-xs">{selected.email}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={selected.rank} />
                <StatusBadge status={selected.status} />
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Phone', value: selected.phone, icon: <Mail size={14} /> },
                  { label: 'Total Sales', value: `DZD ${selected.sales}`, icon: <TrendingUp size={14} /> },
                  { label: 'Commission Earned', value: `DZD ${selected.commission}`, icon: <Award size={14} /> },
                  { label: 'Team Size', value: `${selected.team} members`, icon: <Users size={14} /> },
                  { label: 'Direct Referrals', value: `${selected.referrals}`, icon: <UserCheck size={14} /> },
                  { label: 'Joined', value: selected.joined, icon: <CheckCircle size={14} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#30363D]/50">
                    <span className="flex items-center gap-2 text-[#484F58] text-xs"><span className="text-[#01D7D5]">{item.icon}</span>{item.label}</span>
                    <span className="text-white text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => openEdit(selected)} className="flex-1 py-2 bg-[#01D7D5] text-black text-xs font-medium rounded-lg hover:shadow-[0_0_10px_rgba(1,215,213,0.3)] transition-all">Edit</button>
                {selected.status === 'active' ? (
                  <button onClick={() => handleToggleStatus(selected.id)} className="flex-1 py-2 border border-[#F59E0B] text-[#F59E0B] text-xs font-medium rounded-lg hover:bg-[rgba(245,158,11,0.1)] transition-colors flex items-center justify-center gap-1"><Ban size={12} /> Freeze</button>
                ) : (
                  <button onClick={() => handleToggleStatus(selected.id)} className="flex-1 py-2 border border-[#01D7D5] text-[#01D7D5] text-xs font-medium rounded-lg hover:bg-[rgba(1,215,213,0.1)] transition-colors flex items-center justify-center gap-1"><CheckCircle size={12} /> Activate</button>
                )}
                <button onClick={() => handleDelete(selected.id)} className="px-3 py-2 border border-[#EF4444] text-[#EF4444] text-xs rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={32} className="text-[#30363D] mx-auto mb-3" />
              <p className="text-[#484F58] text-sm">Select a marketer to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editMarketer && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#30363D]">
              <h3 className="text-white font-semibold">Edit Marketer</h3>
              <button onClick={() => setEditMarketer(null)} className="text-[#484F58] hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Full Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Email</label>
                  <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Phone</label>
                  <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Rank</label>
                  <select value={formRank} onChange={(e) => setFormRank(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                    {RANKS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Sales</label>
                  <input value={formSales} onChange={(e) => setFormSales(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Commission</label>
                  <input value={formCommission} onChange={(e) => setFormCommission(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Team Size</label>
                  <input type="number" value={formTeam} onChange={(e) => setFormTeam(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveEdit} className="flex-1 py-2.5 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">Save Changes</button>
                <button onClick={() => setEditMarketer(null)} className="flex-1 py-2.5 border border-[#30363D] text-white rounded-lg hover:border-[#01D7D5] transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
