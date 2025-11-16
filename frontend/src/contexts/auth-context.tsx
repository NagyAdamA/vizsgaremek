import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient, axiosClientWithoutAuth } from '@/lib/axios-client'
import { useNavigate } from '@tanstack/react-router'

type User = {
  userID: number
  username: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (userID: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  const checkAuthStatus = async () => {
    try {
      const response = await axiosClient.get<User>('/api/auth/status')
      setUser(response.data)
      return response.data
    } catch (error: any) {
      // If 401, user is not authenticated
      if (error.response?.status === 401) {
        setUser(null)
        return null
      }
      // For other errors, still set user to null but log the error
      console.error('Auth check error:', error)
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const login = async (userID: string, password: string) => {
    try {
      await axiosClientWithoutAuth.post('/api/auth/login', { userID, password })
      const userData = await checkAuthStatus()
      if (userData) {
        queryClient.invalidateQueries()
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      // Try to call logout endpoint, but don't fail if it errors
      await axiosClient.delete('/api/auth/logout').catch(() => {
        // Ignore errors - we'll clear local state anyway
      })
    } catch (error) {
      // Ignore errors
    }
    
    // Always clear local state regardless of API call success
    setUser(null)
    setIsLoading(false)
    queryClient.clear()
    
    // Don't call checkAuthStatus here as it would set isLoading back to true
    // The state is already cleared, which is what we want
  }

  const checkAuth = async () => {
    await checkAuthStatus()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

