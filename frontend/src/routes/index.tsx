import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Target,
  BarChart3,
  Plus,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: <Target className="w-12 h-12 text-primary" />,
      title: 'Bruh',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      icon: <Plus className="w-12 h-12 text-primary" />,
      title: 'Placeholder',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      title: 'Szeretem a palacsintát',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: 'Cica',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Target className="w-24 h-24 md:w-32 md:h-32 text-primary" />
            <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
              <span className="text-gray-300">Online</span>{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                beírólap
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            Vezesd könnyedén az edzések és versenyek eredményeit.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Lásd a fejlődést a statisztikákban.
          </p>
          <div className="flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/sessions/create"
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-lg shadow-primary/50"
                >
                  Új session
                </Link>
                <div className="flex gap-4">
                  <Link
                    to="/sessions"
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Összes session
                  </Link>
                  <Link
                    to="/statistics"
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Statisztika
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-lg shadow-primary/50"
                >
                  Bejelentkezés
                </Link>
                <Link
                  to="/registration"
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Regisztráció
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
