import { Navigate } from 'react-router'
import { isMarketerLoggedIn } from '@/hooks/marketerAuth'

interface MarketerGuardProps {
  children: React.ReactNode
}

export default function MarketerGuard({ children }: MarketerGuardProps) {
  if (!isMarketerLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
