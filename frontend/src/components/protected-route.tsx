import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Nincs bejelentkezve, átirányítás a login oldalra')
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Fiók ellenőrzése...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('nincs bejelentkezve')
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">Átirányítás a bejelentkezéshez...</p>
        </div>
      </div>
    )
  }

  console.log('Sikeren bejelentkezve, átirányitas')
  return <>{children}</>
}

