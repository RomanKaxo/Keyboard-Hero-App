import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthProvider'

export function RequireRole({ role, children }: { role: 'student' | 'admin'; children: ReactNode }) {
  const { session, profile, loading } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/login" replace />
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/teacher' : '/student'} replace />
  }
  return <>{children}</>
}
