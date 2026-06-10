import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { Shield, Users, Crown, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'

export default function AdminSetup() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { data: adminCheck, refetch: refetchAdminCheck } = trpc.adminSetup.checkAdmin.useQuery()
  const { data: allUsers } = trpc.adminSetup.listUsers.useQuery()
  const promoteMutation = trpc.adminSetup.promote.useMutation({
    onSuccess: () => refetchAdminCheck(),
  })
  const promoteByEmailMutation = trpc.adminSetup.promoteByEmail.useMutation({
    onSuccess: () => refetchAdminCheck(),
  })

  const [email, setEmail] = useState('')
  const [showAllUsers, setShowAllUsers] = useState(false)

  const handlePromoteCurrentUser = () => {
    if (user?.id) {
      promoteMutation.mutate({ userId: user.id })
    }
  }

  const handlePromoteByEmail = () => {
    if (email.trim()) {
      promoteByEmailMutation.mutate({ email: email.trim() })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#30363D] border-t-[#01D7D5] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield size={48} className="text-[#01D7D5] mx-auto mb-4" />
          <h1 className="text-white font-semibold text-2xl mb-2">Authentication Required</h1>
          <p className="text-[#8B949E] mb-6">You must be signed in to access admin setup.</p>
          <Link to="/login" className="px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg inline-flex items-center gap-2">
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[rgba(1,215,213,0.1)] border border-[#01D7D5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-[#01D7D5]" />
          </div>
          <h1 className="text-white font-semibold text-3xl mb-2">Admin Setup</h1>
          <p className="text-[#8B949E]">Configure admin access for the platform.</p>
        </div>

        {/* Current Status */}
        <div className={`bg-[#161B22] border rounded-xl p-6 mb-6 ${adminCheck?.hasAdmin ? 'border-[#01D7D5]' : 'border-[#F59E0B]'}`}>
          <div className="flex items-center gap-3 mb-3">
            {adminCheck?.hasAdmin ? (
              <CheckCircle size={24} className="text-[#01D7D5]" />
            ) : (
              <AlertTriangle size={24} className="text-[#F59E0B]" />
            )}
            <h2 className="text-white font-semibold text-lg">
              {adminCheck?.hasAdmin ? 'Admin Configured' : 'No Admin Found'}
            </h2>
          </div>
          <p className="text-[#8B949E] text-sm">
            {adminCheck?.hasAdmin
              ? `There are ${adminCheck.adminCount} admin(s) configured on this platform.`
              : 'No admin users exist yet. Use the options below to set up your first admin.'}
          </p>
          {adminCheck?.hasAdmin && adminCheck.admins && (
            <div className="mt-4 space-y-2">
              {adminCheck.admins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-3 bg-[#0A0A0A] rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-[#01D7D5] flex items-center justify-center text-black text-xs font-bold">
                    {admin.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-white text-sm">{admin.name || 'Unknown'}</p>
                    <p className="text-[#484F58] text-xs">{admin.email || ''} · {admin.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Option 1: Promote Current User */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown size={20} className="text-[#FFD700]" />
            <h3 className="text-white font-medium">Option 1: Promote Yourself</h3>
          </div>
          <p className="text-[#8B949E] text-sm mb-4">
            Make your current account ({user?.email || user?.name}) an admin.
          </p>
          <button
            onClick={handlePromoteCurrentUser}
            disabled={promoteMutation.isPending}
            className="px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {promoteMutation.isPending ? 'Processing...' : (
              <>Promote Me to Admin <ArrowRight size={16} /></>
            )}
          </button>
          {promoteMutation.data && (
            <p className={`text-sm mt-3 ${promoteMutation.data.success ? 'text-[#01D7D5]' : 'text-[#EF4444]'}`}>
              {promoteMutation.data.message}
            </p>
          )}
        </div>

        {/* Option 2: Promote by Email */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={20} className="text-[#3B82F6]" />
            <h3 className="text-white font-medium">Option 2: Promote by Email</h3>
          </div>
          <p className="text-[#8B949E] text-sm mb-4">
            Enter the email of an existing user to promote them to admin.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none"
            />
            <button
              onClick={handlePromoteByEmail}
              disabled={promoteByEmailMutation.isPending || !email.trim()}
              className="px-6 py-3 bg-[#30363D] text-white font-medium rounded-lg hover:bg-[#484F58] transition-colors disabled:opacity-50"
            >
              {promoteByEmailMutation.isPending ? '...' : 'Promote'}
            </button>
          </div>
          {promoteByEmailMutation.data && (
            <p className={`text-sm mt-3 ${promoteByEmailMutation.data.success ? 'text-[#01D7D5]' : 'text-[#EF4444]'}`}>
              {promoteByEmailMutation.data.message}
            </p>
          )}
        </div>

        {/* Option 3: View All Users */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 mb-8">
          <button
            onClick={() => setShowAllUsers(!showAllUsers)}
            className="flex items-center gap-3 w-full"
          >
            <Users size={20} className="text-[#8B949E]" />
            <h3 className="text-white font-medium">View All Users</h3>
            <span className="ml-auto text-[#8B949E] text-sm">{showAllUsers ? 'Hide' : 'Show'}</span>
          </button>
          {showAllUsers && allUsers && (
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
              {allUsers.length === 0 && <p className="text-[#484F58] text-sm">No users found.</p>}
              {allUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between bg-[#0A0A0A] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-white text-xs font-bold">
                      {u.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white text-sm">{u.name || 'No name'}</p>
                      <p className="text-[#484F58] text-xs">{u.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      u.role === 'admin' || u.role === 'superadmin'
                        ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]'
                        : u.role === 'marketer'
                        ? 'bg-[rgba(255,215,0,0.15)] text-[#FFD700]'
                        : 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]'
                    }`}>
                      {u.role}
                    </span>
                    {u.role !== 'admin' && u.role !== 'superadmin' && (
                      <button
                        onClick={() => promoteMutation.mutate({ userId: u.id })}
                        className="text-[11px] text-[#01D7D5] hover:underline"
                      >
                        Make Admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Go to Admin */}
        {adminCheck?.hasAdmin && (
          <div className="text-center">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all"
            >
              Go to Admin Panel <ArrowRight size={18} />
            </Link>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
