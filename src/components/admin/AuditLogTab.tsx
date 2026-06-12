import { useState } from 'react'
import { Search, Download, ClipboardList, UserCheck, ShieldAlert, Database, Settings, FileText, LogIn, LogOut } from 'lucide-react'

const auditEntries = [
  { id: 1, user: 'Admin', action: 'Login', target: 'System', details: 'Successful login from 105.235.134.12', ip: '105.235.134.12', date: '2025-06-10 14:23:05', type: 'auth' },
  { id: 2, user: 'Admin', action: 'Update', target: 'Product #3', details: 'Stock updated from 8 to 12 units', ip: '105.235.134.12', date: '2025-06-10 14:25:18', type: 'update' },
  { id: 3, user: 'Admin', action: 'Approve', target: 'Withdrawal #128', details: 'Approved withdrawal of DZD 50,000 for Ahmed Benali', ip: '105.235.134.12', date: '2025-06-10 14:30:42', type: 'approve' },
  { id: 4, user: 'System', action: 'Auto', target: 'Commission Calc', details: 'Monthly commission calculation completed for 156 marketers', ip: '127.0.0.1', date: '2025-06-10 00:00:01', type: 'system' },
  { id: 5, user: 'Admin', action: 'Create', target: 'Notification', details: 'Created "Summer Sale" notification for all customers', ip: '105.235.134.12', date: '2025-06-09 16:45:33', type: 'create' },
  { id: 6, user: 'Karim Hadj', action: 'Login', target: 'System', details: 'Marketer login from mobile app', ip: '154.121.45.78', date: '2025-06-09 10:12:55', type: 'auth' },
  { id: 7, user: 'Admin', action: 'Freeze', target: 'Marketer #6', details: 'Account frozen for Farid Taleb due to inactivity', ip: '105.235.134.12', date: '2025-06-09 09:30:15', type: 'security' },
  { id: 8, user: 'Admin', action: 'Export', target: 'Orders', details: 'Exported 342 orders to CSV format', ip: '105.235.134.12', date: '2025-06-08 17:20:44', type: 'export' },
  { id: 9, user: 'Admin', action: 'Update', target: 'Settings', details: 'Commission rate changed from 4% to 5%', ip: '105.235.134.12', date: '2025-06-08 11:05:22', type: 'update' },
  { id: 10, user: 'Omar Khalef', action: 'Withdraw', target: 'Commission', details: 'Requested withdrawal of DZD 100,000', ip: '197.205.12.34', date: '2025-06-08 08:45:10', type: 'create' },
  { id: 11, user: 'System', action: 'Backup', target: 'Database', details: 'Automatic daily backup completed successfully', ip: '127.0.0.1', date: '2025-06-08 02:00:00', type: 'system' },
  { id: 12, user: 'Admin', action: 'Delete', target: 'Banner #3', details: 'Removed inactive "New Product Launch" banner', ip: '105.235.134.12', date: '2025-06-07 15:12:38', type: 'delete' },
]

const actionIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  Login: { icon: <LogIn size={14} />, color: '#01D7D5' },
  Logout: { icon: <LogOut size={14} />, color: '#484F58' },
  Create: { icon: <FileText size={14} />, color: '#01D7D5' },
  Update: { icon: <Settings size={14} />, color: '#F59E0B' },
  Delete: { icon: <ShieldAlert size={14} />, color: '#EF4444' },
  Approve: { icon: <UserCheck size={14} />, color: '#01D7D5' },
  Freeze: { icon: <ShieldAlert size={14} />, color: '#EF4444' },
  Export: { icon: <Download size={14} />, color: '#3B82F6' },
  Auto: { icon: <Database size={14} />, color: '#8B949E' },
  Backup: { icon: <Database size={14} />, color: '#8B949E' },
  Withdraw: { icon: <FileText size={14} />, color: '#01D7D5' },
}

export default function AuditLogTab() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('All')

  const filtered = auditEntries.filter((e) => {
    const matchSearch = !search || e.user.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === 'All' || e.action === actionFilter
    return matchSearch && matchAction
  })

  const uniqueActions = ['All', ...Array.from(new Set(auditEntries.map((e) => e.action)))]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: `${auditEntries.length}` },
          { label: 'Today', value: '3' },
          { label: 'Admin Actions', value: `${auditEntries.filter((e) => e.user === 'Admin').length}` },
          { label: 'System Events', value: `${auditEntries.filter((e) => e.user === 'System').length}` },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit log..."
            className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
          className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#01D7D5] focus:outline-none">
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#30363D] rounded-lg text-sm text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {['Action', 'User', 'Target', 'Details', 'IP Address', 'Date'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const actionConfig = actionIcons[entry.action] || { icon: <ClipboardList size={14} />, color: '#484F58' }
                return (
                  <tr key={entry.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: actionConfig.color }}>
                        {actionConfig.icon} {entry.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white text-xs">{entry.user}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{entry.target}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs max-w-[300px] truncate">{entry.details}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs font-mono">{entry.ip}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs whitespace-nowrap">{entry.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
