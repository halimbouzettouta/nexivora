import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

interface MarketerGuardProps {
  children: React.ReactNode
}

export default function MarketerGuard({ children }: MarketerGuardProps) {
  const { user, isLoading } = useAuth()

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

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Allow all authenticated users (dashboard adapts to role)
  return <>{children}</>
}
