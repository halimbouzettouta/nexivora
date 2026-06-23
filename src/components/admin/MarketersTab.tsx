import { useState, useMemo } from 'react'
import { Search, UserCheck, UserX } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { getMarketerAccounts } from '@/hooks/marketerAuth'

export default function MarketersTab() {
  const [search, setSearch] = useState('')

  // Fetch users from API with localStorage fallback
  const { data: apiUsers = [], isLoading, refetch } = trpc.adminSetup.listUsers.useQuery(undefined, {
    staleTime: 5000,
    refetchInterval: 10000,
  })

  // Fallback: read marketer accounts from localStorage
  const localAccounts = useMemo(() => getMarketerAccounts(), [apiUsers])
  const localUsers = localAccounts.map((a, idx) => ({
    id: idx + 1,
    name: a.name,
    email: a.username,
    role: 'marketer',
    status: 'active',
    createdAt: a.joinedAt,
    referralCode: a.referralCode,
    rank: a.rank,
  }))

  const users = apiUsers.length > 0 ? apiUsers : localUsers

  // Filter to show only marketers and admins
  const marketers = users.filter((u: any) =>
    (u.role === 'marketer' || u.role === 'admin' || u.role === 'superadmin') &&
    (!search || (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || u.email?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search marketers..."
            className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
        <button onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#30363D] rounded-lg text-sm text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          Refresh
        </button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                <th className="text-left py-3 px-3">Name</th>
                <th className="text-left py-3 px-3">Email</th>
                <th className="text-left py-3 px-3">Role</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Joined</th>
                <th className="text-left py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="py-12 text-center text-[#484F58]">Loading marketers...</td></tr>
              )}
              {!isLoading && marketers.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-[#484F58]">No marketers registered yet.</td></tr>
              )}
              {marketers.map((m: any) => (
                <tr key={m.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-white font-medium text-xs">
                        {(m.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.name || 'Anonymous'}</p>
                        <p className="text-[#484F58] text-xs">ID: {m.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#8B949E]">{m.email || '—'}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      m.role === 'superadmin' ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]' :
                      m.role === 'admin' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' :
                      'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]'
                    }`}>{m.role}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      m.status === 'active' ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' :
                      m.status === 'frozen' ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]' :
                      'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'
                    }`}>{m.status}</span>
                  </td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      {m.role !== 'admin' && m.role !== 'superadmin' && (
                        <button className="text-[#01D7D5] hover:text-white transition-colors" title="Promote to Admin">
                          <UserCheck size={16} />
                        </button>
                      )}
                      <button className="text-[#EF4444] hover:text-white transition-colors" title="Freeze Account">
                        <UserX size={16} />
                      </button>
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
