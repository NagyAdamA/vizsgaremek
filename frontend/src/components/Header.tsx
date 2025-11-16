import { Link, useNavigate } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  X,
  LogIn,
  UserPlus,
  Target,
  BarChart3,
  Plus,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setIsOpen(false)
      await logout()
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 100)
    } catch (error) {
      console.error('Sikertlen kilepes:', error)
      navigate({ to: '/login' })
    }
  }

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <span className="text-white">bruh moment</span>
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <LogIn size={20} />
                <span className="font-medium">Login</span>
              </Link>

              <Link
                to="/registration"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <UserPlus size={20} />
                <span className="font-medium">Registration</span>
              </Link>
            </>
          ) : (
            <>
              {user && (
                <div className="px-3 py-2 mb-2 text-sm text-gray-400 border-b border-gray-700">
                  Logged in as: <span className="text-white font-medium">{user.username}</span>
                </div>
              )}
              <Link
                to="/sessions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Target size={20} />
                <span className="font-medium">Sessions</span>
              </Link>

              <Link
                to="/sessions/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Plus size={20} />
                <span className="font-medium">New Session</span>
              </Link>

              <Link
                to="/statistics"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Statistics</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 w-full text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
