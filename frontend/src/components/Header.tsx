import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  LogIn,
  UserPlus,
  Target,
  BarChart3,
  Plus,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const router = useRouterState()
  const currentPath = router.location.pathname
  const isSessionsActive = currentPath === '/sessions' || (currentPath.startsWith('/sessions/') && currentPath !== '/sessions/create')

  const handleLogout = async () => {
    try {
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
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">
        <Link to="/">
          <span className="text-white">Beírólap</span>
        </Link>
      </h1>

      <nav className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              activeProps={{
                className:
                  'flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground transition-colors',
              }}
            >
              <LogIn size={20} />
              <span className="font-medium hidden md:inline">Bejelentkezés</span>
            </Link>

            <Link
              to="/registration"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              activeProps={{
                className:
                  'flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground transition-colors',
              }}
            >
              <UserPlus size={20} />
              <span className="font-medium hidden md:inline">Regisztráció</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/sessions"
              className={
                isSessionsActive
                  ? 'flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground transition-colors'
                  : 'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors'
              }
            >
              <Target size={20} />
              <span className="font-medium hidden md:inline">Beírólapok</span>
            </Link>

            <Link
              to="/sessions/create"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              activeProps={{
                className:
                  'flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground transition-colors',
              }}
            >
              <Plus size={20} />
              <span className="font-medium hidden md:inline">Új beírólap</span>
            </Link>

            <Link
              to="/statistics"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              activeProps={{
                className:
                  'flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground transition-colors',
              }}
            >
              <BarChart3 size={20} />
              <span className="font-medium hidden md:inline">Statisztika</span>
            </Link>

            <div className="flex items-center ml-4 gap-4 border-l border-gray-600 pl-4">
              {user && (
                <span className="text-sm text-gray-300 hidden lg:inline">
                  {user.username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/20 text-destructive-foreground transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
