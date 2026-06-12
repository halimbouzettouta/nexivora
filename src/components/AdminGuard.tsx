import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/hooks/adminAuth'
import { ShieldAlert } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isAdmin: authIsAdmin } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#30363D] border-t-[#01D7D5] rounded-full animate-spin" />
          <p className="text-[#8B949E] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Check both OAuth admin role and password-based admin
  const hasAccess = authIsAdmin || isAdmin()

  if (!user && !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-[rgba(239,68,68,0.1)] border border-[#EF4444]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={36} className="text-[#EF4444]" />
          </div>
          <h1 className="text-white font-semibold text-2xl mb-2">Access Denied</h1>
          <p className="text-[#8B949E] mb-6">
            You don&apos;t have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/" className="px-6 py-2.5 bg-[#01D7D5] text-black font-medium rounded-lg text-sm hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
              Go Home
            </a>
            <a href="/dashboard" className="px-6 py-2.5 border border-[#30363D] text-white font-medium rounded-lg text-sm hover:border-[#01D7D5] transition-colors">
              My Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
