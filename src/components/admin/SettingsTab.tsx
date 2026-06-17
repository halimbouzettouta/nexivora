import { useState } from 'react'
import { Settings, DollarSign, Trophy, CreditCard, Truck, Shield, UserCheck, Lock, KeyRound } from 'lucide-react'
import { changeAdminPassword } from '@/hooks/adminAuth'

const sections = [
  { id: 'general', label: 'General', icon: <Settings size={16} /> },
  { id: 'commission', label: 'Commission', icon: <DollarSign size={16} /> },
  { id: 'rank', label: 'Ranks', icon: <Trophy size={16} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 'shipping', label: 'Shipping', icon: <Truck size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  { id: 'roles', label: 'Roles', icon: <UserCheck size={16} /> },
]

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordChange = async () => {
    setPwdError('')
    setPwdSuccess('')

    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError('Please fill in all fields')
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match')
      return
    }
    if (newPwd.length < 6) {
      setPwdError('Password must be at least 6 characters')
      return
    }

    const ok = await changeAdminPassword(currentPwd, newPwd)
    if (ok) {
      setPwdSuccess('Password changed successfully!')
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } else {
      setPwdError('Current password is incorrect')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-2 sticky top-24">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeSection === s.id ? 'bg-[rgba(1,215,213,0.1)] text-[#01D7D5]' : 'text-[#8B949E] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 space-y-4">
        {saved && (
          <div className="bg-[rgba(1,215,213,0.1)] border border-[#01D7D5]/20 rounded-lg p-3 text-[#01D7D5] text-sm">
            Settings saved successfully!
          </div>
        )}

        {activeSection === 'general' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Platform Name</label>
                <input defaultValue="Nexivora Algeria" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Currency</label>
                <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                  <option>DZD (Algerian Dinar)</option>
                </select>
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Timezone</label>
                <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                  <option>Africa/Algiers (GMT+1)</option>
                </select>
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Default Language</label>
                <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                  <option>English / Arabic</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'commission' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Commission Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Direct Commission (%)</label>
                <input type="number" defaultValue="5" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Team Bonus Pool (%)</label>
                <input type="number" defaultValue="5" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Min. Payout (DZD)</label>
                <input type="number" defaultValue="5000" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Payout Schedule</label>
                <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'rank' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Rank Configuration</h3>
            <div className="space-y-3">
              {[
                { name: 'Starter', personal: 0, team: 0, direct: 0 },
                { name: 'Silver', personal: 500000, team: 0, direct: 10 },
                { name: 'Gold', personal: 500000, team: 2000000, direct: 25 },
                { name: 'Platinum', personal: 500000, team: 5000000, direct: 50 },
                { name: 'Diamond', personal: 500000, team: 10000000, direct: 100 },
              ].map((rank) => (
                <div key={rank.name} className="grid grid-cols-4 gap-3 items-center bg-[#0A0A0A] rounded-lg p-3">
                  <span className="text-white text-sm">{rank.name}</span>
                  <input defaultValue={rank.personal} className="bg-[#161B22] border border-[#30363D] text-white text-xs rounded px-2 py-1.5" placeholder="Personal" />
                  <input defaultValue={rank.team} className="bg-[#161B22] border border-[#30363D] text-white text-xs rounded px-2 py-1.5" placeholder="Team" />
                  <input defaultValue={rank.direct} className="bg-[#161B22] border border-[#30363D] text-white text-xs rounded px-2 py-1.5" placeholder="Direct" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'payment' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Payment Gateways</h3>
            {[
              { name: 'Credit/Debit Card (Stripe)', enabled: true },
              { name: 'Cash on Delivery', enabled: true },
              { name: 'BaridiMob', enabled: true },
            ].map((gateway) => (
              <div key={gateway.name} className="flex items-center justify-between bg-[#0A0A0A] rounded-lg p-3">
                <span className="text-white text-sm">{gateway.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={gateway.enabled} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#30363D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#01D7D5]" />
                </label>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'shipping' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Shipping Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Standard Rate (DZD)</label>
                <input type="number" defaultValue="2500" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Express Rate (DZD)</label>
                <input type="number" defaultValue="5000" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Free Shipping Threshold (DZD)</label>
                <input type="number" defaultValue="100000" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-4">
            {/* Change Admin Password */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound size={18} className="text-[#EF4444]" />
                <h3 className="text-white font-medium">Change Admin Password</h3>
              </div>
              <p className="text-[#484F58] text-xs">Change the password used to access the admin panel. Default: <span className="text-[#8B949E]">Eride2025!</span></p>

              {pwdSuccess && (
                <div className="bg-[rgba(1,215,213,0.1)] border border-[#01D7D5]/20 rounded-lg p-3 text-[#01D7D5] text-sm">
                  {pwdSuccess}
                </div>
              )}
              {pwdError && (
                <div className="bg-[rgba(239,68,68,0.1)] border border-[#EF4444]/20 rounded-lg p-3 text-[#EF4444] text-sm">
                  {pwdError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Current Password</label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => { setCurrentPwd(e.target.value); setPwdError('') }}
                    placeholder="Enter current password"
                    className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">New Password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => { setNewPwd(e.target.value); setPwdError('') }}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => { setConfirmPwd(e.target.value); setPwdError('') }}
                    placeholder="Confirm new password"
                    className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full py-2.5 bg-[#EF4444] text-white font-medium rounded-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                Change Password
              </button>
            </div>

            {/* Other Security Settings */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
              <h3 className="text-white font-medium">Security Settings</h3>
              {[
                { label: 'Enforce 2FA for Admins', desc: 'Require two-factor authentication for all admin accounts', enabled: false },
                { label: 'Strong Password Policy', desc: 'Require minimum 8 characters with symbols', enabled: true },
                { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                { label: 'Auto Backup', desc: 'Daily automatic database backups', enabled: true },
              ].map((setting) => (
                <div key={setting.label} className="flex items-start justify-between bg-[#0A0A0A] rounded-lg p-3">
                  <div>
                    <p className="text-white text-sm">{setting.label}</p>
                    <p className="text-[#484F58] text-xs">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                    <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#30363D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#01D7D5]" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'roles' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Role Management</h3>
            {[
              { name: 'Super Admin', desc: 'Full platform access', users: 1, color: '#EF4444' },
              { name: 'Admin', desc: 'Manage products, orders, marketers, content', users: 2, color: '#F59E0B' },
              { name: 'Sales Manager', desc: 'Manage orders and customers', users: 3, color: '#3B82F6' },
              { name: 'Marketing Manager', desc: 'Manage marketers and campaigns', users: 2, color: '#01D7D5' },
              { name: 'Customer Support', desc: 'Handle tickets and customer issues', users: 5, color: '#8B949E' },
            ].map((role) => (
              <div key={role.name} className="flex items-center justify-between bg-[#0A0A0A] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                  <div>
                    <p className="text-white text-sm">{role.name}</p>
                    <p className="text-[#484F58] text-xs">{role.desc}</p>
                  </div>
                </div>
                <span className="text-[#8B949E] text-xs">{role.users} users</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleSave} className="w-full py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
          Save Changes
        </button>
      </div>
    </div>
  )
}
