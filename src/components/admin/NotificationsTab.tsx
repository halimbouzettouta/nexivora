import { useState } from 'react'
import { Send, Users, Clock, Mail, MessageSquare, Smartphone } from 'lucide-react'

const sentHistory = [
  { id: 1, title: 'Summer Sale is Live!', recipients: 'All Customers', type: 'in_app', sent: '2025-06-05 10:00', delivered: 2840, read: 1920 },
  { id: 2, title: 'New Rank Achievement', recipients: 'Marketers', type: 'email', sent: '2025-06-04 14:30', delivered: 156, read: 134 },
  { id: 3, title: 'Maintenance Reminder', recipients: 'Subscribers', type: 'sms', sent: '2025-06-03 09:00', delivered: 201, read: 189 },
  { id: 4, title: 'Product Restock Alert', recipients: 'All Customers', type: 'in_app', sent: '2025-06-02 16:00', delivered: 2840, read: 1560 },
]

const scheduled = [
  { id: 1, title: 'Weekly Commission Report', recipients: 'Marketers', type: 'email', scheduled: '2025-06-12 08:00' },
  { id: 2, title: 'Flash Sale 24h', recipients: 'All Customers', type: 'in_app', scheduled: '2025-06-15 00:00' },
]

export default function NotificationsTab() {
  const [activeView, setActiveView] = useState<'compose' | 'scheduled' | 'history'>('compose')
  const [recipientType, setRecipientType] = useState('all')
  const [notifType, setNotifType] = useState('in_app')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: '4,037' },
          { label: 'Delivered', value: '3,920', color: '#01D7D5' },
          { label: 'Read Rate', value: '68%' },
          { label: 'Scheduled', value: `${scheduled.length}` },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-b border-[#30363D]">
        {(['compose', 'scheduled', 'history'] as const).map((v) => (
          <button key={v} onClick={() => setActiveView(v)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeView === v ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#484F58] border-transparent hover:text-white'}`}>
            {v === 'compose' ? 'Compose' : v}
          </button>
        ))}
      </div>

      {activeView === 'compose' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="text-[#8B949E] text-xs mb-1 block">Recipients</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'All Users', icon: <Users size={14} /> },
                  { id: 'customers', label: 'All Customers', icon: <Users size={14} /> },
                  { id: 'marketers', label: 'All Marketers', icon: <Users size={14} /> },
                  { id: 'specific', label: 'Specific Users', icon: <Users size={14} /> },
                ].map((r) => (
                  <button key={r.id} onClick={() => setRecipientType(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${recipientType === r.id ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5] border border-[#01D7D5]/30' : 'bg-[#0A0A0A] border border-[#30363D] text-[#8B949E] hover:text-white'}`}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#8B949E] text-xs mb-1 block">Notification Type</label>
              <div className="flex gap-2">
                {[
                  { id: 'in_app', label: 'In-App', icon: <MessageSquare size={14} /> },
                  { id: 'email', label: 'Email', icon: <Mail size={14} /> },
                  { id: 'sms', label: 'SMS', icon: <Smartphone size={14} /> },
                ].map((t) => (
                  <button key={t.id} onClick={() => setNotifType(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${notifType === t.id ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5] border border-[#01D7D5]/30' : 'bg-[#0A0A0A] border border-[#30363D] text-[#8B949E] hover:text-white'}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#8B949E] text-xs mb-1 block">Title</label>
              <input className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" placeholder="Notification title..." />
            </div>

            <div>
              <label className="text-[#8B949E] text-xs mb-1 block">Message</label>
              <textarea rows={4} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none resize-none" placeholder="Enter your message..." />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-[#30363D] bg-[#161B22] text-[#01D7D5]" />
              <span className="text-[#8B949E] text-xs">Schedule for later</span>
              <input type="datetime-local" className="bg-[#0A0A0A] border border-[#30363D] text-white text-xs rounded-lg px-3 py-1.5" />
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
                <Send size={16} /> Send Now
              </button>
              <button className="px-6 py-3 border border-[#30363D] text-[#8B949E] rounded-lg hover:border-[#01D7D5] transition-colors">
                Save as Template
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'scheduled' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Title', 'Recipients', 'Type', 'Scheduled', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {scheduled.map((s) => (
                  <tr key={s.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{s.title}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{s.recipients}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs capitalize">{s.type}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs flex items-center gap-1"><Clock size={12} />{s.scheduled}</td>
                    <td className="py-3 px-3">
                      <button className="text-[#EF4444] text-xs hover:underline">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'history' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Title', 'Recipients', 'Type', 'Sent', 'Delivered', 'Read', 'Rate'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sentHistory.map((h) => (
                  <tr key={h.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{h.title}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{h.recipients}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs capitalize">{h.type}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{h.sent}</td>
                    <td className="py-3 px-3 text-[#01D7D5]">{h.delivered}</td>
                    <td className="py-3 px-3 text-white">{h.read}</td>
                    <td className="py-3 px-3 text-[#01D7D5]">{((h.read / h.delivered) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
