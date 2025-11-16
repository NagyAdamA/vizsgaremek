import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: Not authenticated, redirecting to login')
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, returning null')
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  console.log('ProtectedRoute: Authenticated, rendering children')
  return <>{children}</>
}

